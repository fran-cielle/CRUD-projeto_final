const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const voluntarios = require('./routes/voluntarios')
const PORT = process.env.PORT || 3000
require('dotenv').config();

app.use(cors())
app.use(bodyParser.json())
app.use('/voluntarios', voluntarios)

app.get('/', (request, response) => {
  response.send('Olá, mundo!')
})

app.listen(PORT)
console.info(`Rodando na porta ${PORT}`)


