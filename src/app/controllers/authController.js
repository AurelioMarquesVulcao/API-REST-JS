const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const authConfig = require('../../config/auth.json');

const User = require('../models/user');

const router = express.Router();


function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    // tempo para expirar... foi ajustado para expirar em 1 dia
    expiresIn: 86400,

  });
}


router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    // para poder verificar se o email é unico estou usando o if
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'User already exists' });

    const user = await User.create(req.body);

    // faz com que o password não seja exibido na resposta
    user.password = undefined;

    return res.send({ 
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(400).send({ error: 'Resgistration failed' });
  }
});


router.post('/authenticate', async (req, res) => {
  // para loca também posso usar user name e password ou outra coisa também
  const { email, password } = req.body;

  // para poder requisitar e testar o password que esta por padrão
  // select : false, uso select('+password')
  const user = await User.findOne({ email }).select('+password');

  if (!user)
    return res.status(400).send({ error: 'User not found' });

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Invalid password' });

  // faz com que o password não seja exibido na resposta
  user.password = undefined;



  res.send({
    user,
    token: generateToken({ id: user.id }),
  });

});


module.exports = app => app.use('/auth', router);