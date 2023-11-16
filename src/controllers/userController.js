
const db = require('../config/firebaseConfig')
const { dateValidate, capitalizeFirstLetter } = require('../functions/functions')
const bcrypt = require('bcrypt')
const {addDoc, collection} = require('firebase/firestore')

const newUser = async (req, res) => {
  const {nome, sobrenome, sexo, senha, email, cargo, telefone} = req.body
  const data_cont = dateValidate(req.body.data_cont)
  const data_nasc = dateValidate(req.body.data_nasc)

  if(!nome || !sobrenome || !sexo || !senha || !email || !cargo || !telefone) return res.status(400).json({mensagem: 'Todos os campos são obrigatórios'})
  if(!data_cont || !data_nasc) return res.status(400).json({mensagem: 'Insira uma data válida'})

  const passwordCryp = await bcrypt.hash(senha, 10)

  const newUser = {
    nome,
    sobrenome,
    cargo,
    sexo,
    email,
    senha: passwordCryp,
    cargo,
    telefone,
    data_cont,
    data_nasc
  }

  try {
    await addDoc(collection(db, "usuarios"), newUser);
    const {senha: _, ...userCreated} = newUser
    res.status(201).json(userCreated)
  } catch (error) {
    console.log(error);
    return res.status(500).json({mensagem: "Erro interno no servidor!"})
  }
}

module.exports = {
  newUser
}