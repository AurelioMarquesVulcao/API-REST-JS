const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided' });

    // formato padrão de um token... Bearer hbcdsbbkdbdsjb

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error' });

    const [ scheme, token ] = parts;

    // usamos rejecs
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted' });

    // decoded = id do usuario   ---  secret vem de auth.json
    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({ error: 'Token invalid' })

        // decoded id vem da geração de token do auth controler
        // onde geramos um token para um id único
        req.userId = decoded.id;
        return next();
    });


};


// a verificação consome muita memoria verificações mais simples (uso menos memoria) poupam nosso backend