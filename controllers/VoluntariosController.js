const { connect } = require('../models/Repository')
const voluntariosModel = require('../models/VoluntariosSchema')
const { alunosModel } = require('../models/alunosSchema')
const bcrypt = require('bcryptjs')

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
const alterar = (request, response) => {
  const id = request.params.id
  const alunoUpdate = request.body
  const options = { new: true }

  voluntariosModel.findByIdAndUpdate(
    id,
    alunoUpdate,
    options,
    (error, aluno) => {
      if (error) {
        return response.status(500).send(error)
      }

      if (aluno) {
        return response.status(200).send(aluno)
      }

      return response.status(404).send('Aluno não encontrado.')
    }
  )
}
const remove = (request, response) => {
  const id = request.params.id

  voluntariosModel.findByIdAndDelete(id, (error, voluntario) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (voluntario) {
      return response.status(200).send(id)
    }

    return response.status(404).send('Voluntário não encontrado.')
  })
}
const addAluno = async (request, response) => {
  const voluntarioId = request.params.voluntarioId
  const aluno = request.body
  const options = { new: true }
  const novoAluno = new alunosModel(aluno)
  const treinador = await voluntariosModel.findById(voluntarioId)

  treinador.alunos.push(novoAluno)
  treinador.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(treinador)
  })
}



module.exports = {
  getAll,
  add,
  alterar,
  remove,
  addAluno
}