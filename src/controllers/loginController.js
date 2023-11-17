require('dotenv').config();
const knex = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passHash = process.env.JWT_PASSWORD;

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(404)
      .json({ mensagem: 'Por favor, informar email e senha' });
  }

  try {
    const existUser = await knex('usuarios')
      .innerJoin('cargos', function () {
        this.on('cargos.id', '=', 'usuarios.cargo_id');
      })
      .where('usuarios.email', email)
      .select('usuarios.*', 'cargos.funcao');

    if (existUser.length === 0) {
      return res
        .status(400)
        .json({ mensagem: 'Email ou senha incorretos, tente novamente' });
    }

    const user = existUser[0];

    const passCorrect = await bcrypt.compare(senha, user.senha);

    if (!passCorrect) {
      return res
        .status(400)
        .json({ mensagem: 'Email ou senha incorretos, tente novamente' });
    }

    const token = jwt.sign({ id: user.id }, passHash, { expiresIn: '8h' });

    const { senha: _, ...userData } = user;

    return res.json({ usuario: userData, token });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor!' });
  }
};

module.exports = {
  login,
};
