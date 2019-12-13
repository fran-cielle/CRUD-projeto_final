const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const voluntario = require('./routes/voluntario')
const PORT = 3000

app.use(cors())
app.use(bodyParser.json())
app.use('/voluntario', voluntario)

app.get('/', (request, response) => {
  response.send('Olá, mundo!')
})

app.listen(PORT)
console.info(`Rodando na porta ${PORT}`)
