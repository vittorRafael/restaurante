require('dotenv').config()
const knex = require('../config/db');
const jwt = require('jsonwebtoken');
const passHash = process.env.JWT_PASSWORD;

const checkLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.'});
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, passHash);
        const existUser = await knex('usuarios').innerJoin('cargos', function() {
            this
              .on('cargos.id', '=', 'usuarios.cargo_id')
          }).where('usuarios.id', id).select('usuarios.*', 'cargos.funcao')

        if (existUser.length === 0) {
            return res.status(401).json({mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.'});
        }

        const { senha: _, ...user } = existUser[0];

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json({mensagem: 'Não autorizado, faça login e tente novamente'});
    }
}

module.exports = checkLogin