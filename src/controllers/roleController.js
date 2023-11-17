const knex = require('../config/db');

const listRoles = async (req, res) => {
  try {
    const roles = await knex('cargos')
    return res.json(roles)
  } catch (error) { 
    return res.status(500).json({ mensagem: 'Erro interno no servidor!' });
  }
}

module.exports = {
  listRoles
}