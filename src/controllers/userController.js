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
  if (isNaN(cargo_id))
    return res.status(400).json({
      mensagem: 'Cargo inválido, informe um cargo válido e tente novamente',
    });
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
      data_cadastro: dateValidate(new Date()),
    };
    const user = await knex('usuarios').insert(newUser).returning('*');
    if (user.length === 0)
      return res
        .status(400)
        .json('Não foi possível cadastrar o usuário, tente novamente');

    const { senha: _, ...userRegister } = user[0];
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor!' });
  }
};

const getUser = async (req, res) => {
  res.json(req.user);
};

const updateUser = async (req, res) => {
  const id = req.user.id;
  const { nome, sobrenome, sexo, email, cargo_id, telefone } = req.body;
  const data_nascimento = req.body.data_nascimento
    ? dateValidate(req.body.data_nascimento)
    : dateValidate(req.user.data_nascimento);
  if (cargo_id && isNaN(cargo_id))
    return res.status(400).json({
      mensagem: 'Cargo inválido, informe um cargo válido e tente novamente',
    });
  if (!data_nascimento)
    return res.status(400).json({ mensagem: 'Insira uma data válida' });

  const newData = {
    nome: capitalizeFirstLetter(nome) || req.user.nome,
    sobrenome: capitalizeFirstLetter(sobrenome) || req.user.sobrenome,
    cargo_id: cargo_id || req.user.cargo_id,
    sexo: capitalizeFirstLetter(sexo) || req.user.sexo,
    email: email || req.user.email,
    telefone: telefone || req.user.telefone,
    data_nascimento,
  };
  if (
    newData.nome === req.user.nome &&
    newData.sobrenome === req.user.sobrenome &&
    newData.sexo === req.user.sexo &&
    newData.cargo_id === req.user.cargo_id &&
    newData.telefone === req.user.telefone &&
    newData.data_nascimento === dateValidate(req.user.data_nascimento)
  )
    return res.status(400).json({
      mensagem:
        'Nenhuma informação para ser atualizada, preencha algum campo e tente novamente!',
    });

  try {
    const user = await knex('usuarios')
      .where({ id })
      .update(newData)
      .returning('*');
    const { senha: _, ...userUpdated } = user[0];
    return res.json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor!' });
  }
};

const removeUser = async (req, res) => {
  const id = req.user.id;

  try {
    const deletados = await knex('usuarios').where('id', id).del();
    if (deletados < 1)
      return res.status(400).json({
        mensagem: 'Não foi possível deletar seu usuário, tente novamente',
      });
    return res.json('Usuário deletado com sucesso');
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor!' });
  }
};

module.exports = {
  newUser,
  getUser,
  updateUser,
  removeUser,
};
