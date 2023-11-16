const express = require('express')
const app = express()
const router = require('./routes/routes')

app.use(express.json())
app.use(router)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
})