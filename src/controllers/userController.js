const knex = require('../config/db');
const {
  dateValidate,
  capitalizeFirstLetter,
} = require('../functions/functions');
const bcrypt = require('bcrypt');

const newUser = async (req, res) => {
  const { nome, sobrenome, sexo, senha, email, cargo_id, telefone } = req.body;
  const data_nascimento = dateValidate(req.body.data_nascimento);

  if (!nome || !sobrenome || !sexo || !senha || !email || !telefone)
    return res
      .status(400)
      .json({ mensagem: 'Todos os campos são obrigatórios' });
  if(isNaN(cargo_id)) return res
  .status(400)
  .json({ mensagem: 'Cargo inválido, informe um cargo válido e tente novamente' });
  if (!data_nascimento)
    return res.status(400).json({ mensagem: 'Insira uma data válida' });

  try {
    const existUser = await knex('usuarios').where('email', email);
    if (existUser.length > 0)
      return res.status(400).json('O email informado já está cadastrado');

    const passwordCryp = await bcrypt.hash(senha, 10);

    const newUser = {
      nome: capitalizeFirstLetter(nome),
      sobrenome: capitalizeFirstLetter(sobrenome),
      cargo_id,
      sexo: capitalizeFirstLetter(sexo),
      email,
      senha: passwordCryp,
      telefone,
      data_nascimento,
      data_cadastro: dateValidate(new Date())
    };
    const user = await knex('usuarios').insert(newUser).returning('*')
    if(user.length === 0) return res.status(400).json("Não foi possível cadastrar o usuário, tente novamente")

    const {senha: _, ...userRegister } = user[0]
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor!' });
  }
};

module.exports = {
  newUser,
};
