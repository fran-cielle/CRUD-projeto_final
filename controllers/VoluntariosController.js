const { connect } = require('../models/Repository')
const voluntariosModel = require('../models/VoluntariosSchema')
const bcrypt = require('bcryptjs')
//const { alunosModel } = require('../models/alunosSchema')

connect()

const getAll = (request, response) => {
  voluntariosModel.find((error, voluntarios) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(200).send(voluntarios)
  })
}

//ADD UM NOVO VOLUNTARIO, ROTA voluntarios post
const add = (request, response) => {
  const senhaCriptografada = bcrypt.hashSync(request.body.senha)
  request.body.senha = senhaCriptografada
  request.body.grupo = 'professor'
  const novoVoluntario = new voluntariosModel(request.body)

  novoVoluntario.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(novoVoluntario)
  })
}

module.exports = {
  getAll,
  add
}