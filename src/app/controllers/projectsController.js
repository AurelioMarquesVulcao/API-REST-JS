const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

// validação da autenticação nas rotas
router.use(authMiddleware);

// router.get('/', (req, res) => {
//     // como usei user id no auth eu posso chamalo aqui.
//     res.send({ user: req.userId });
// });

router.get('/', async (req, res) => {
    try {
        // usando o egear loding do mongo posso pegar dados do usuario
        // usando o .populate('user')
        // const projects = await Project.find().populate('user');
        const projects = await Project.find().populate(['user', 'tasks']);
        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projets' });
    }

});


router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('user');
        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projet' });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;


        // o req.userID vem do authMiddleware
        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project' });
    }

});


router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        // o req.userID vem do authMiddleware
        const project = await Project.findByIdAndUpdate(req.params.projectId, {
            title,
            description
        },{ new: true });
        // mongoose por padrão retorna os dados antigos
        // {new:true} ira me retornar os dados atualizados

        // para não criarmos tasks duplicadas temos que apagalas antes de atualizalas
        project.tasks = [];
        await Task.remove({ project: project._id });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error updating project' });
    }

});


router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId);
        // estou deletando e posso usar um send vazio
        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting projet' });
    }
});


module.exports = app => app.use('/projects', router);



// postagem simples
// router.post('/', async (req, res) => {
//     try {
//         const project = await Project.create(req.body);
//         return res.send({ project });
//     } catch (err) {
//         return res.status(400).send({ error: 'Error creating new project' });
//     }

// });

// postagem apenas colocando user Id
// router.post('/', async (req, res) => {
//     try {

//         // o req.userID vem do authMiddleware
//         const project = await Project.create({ ...req.body, user: req.userId });
//         return res.send({ project });
//     } catch (err) {
//         return res.status(400).send({ error: 'Error creating new project' });
//     }

// });