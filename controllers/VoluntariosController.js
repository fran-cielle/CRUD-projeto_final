const { connect } = require('../models/Repository')
const voluntariosModel = require('../models/VoluntariosSchema')
const { alunosModel } = require('../models/alunosSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').load
const SEGREDO = process.env.SEGREDO
connect()

const login = async (request, response) => {
  const voluntarioEncontrado = await voluntariosModel.findOne({ email: request.body.email })

  if (voluntarioEncontrado) {
    const senhaCorreta = bcrypt.compareSync(request.body.senha, voluntarioEncontrado.senha)

    if (senhaCorreta) {
      const token = jwt.sign(
        {
          grupo: voluntarioEncontrado.grupo
        },
        SEGREDO,
        { expiresIn: 6000 }
      )

      return response.status(200).send({ token })
    }

    return response.status(401).send('Senha incorreta.')
  }

  return response.status(404).send('Voluntario não encontrado.')
}
//GET
const getAll = (request, response) => {
  voluntariosModel.find((error, voluntarios) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(200).send(voluntarios)
  })
}

const getById = (request, response) => {
  const id = request.params.id

  return voluntariosModel.findById(id, (error, voluntario) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (voluntario) {
      return response.status(200).send(voluntario)
    }

    return response.status(404).send('Voluntario não encontrado.')
  })
}

const getAlunos = async (request, response) => {
  const voluntarioId = request.params.id
  await voluntariosModel.findById(voluntarioId, (error, voluntario) => {
    if (error) {
      return response.status(500).send(error)
    }
    if (voluntario) {
      return response.status(200).send(voluntario.alunos)
    }

    return response.status(404).send('Voluntario não encontrado.')
  })
}

const getAlunoById = async (request, response) => {
  const voluntarioId = request.params.voluntarioId
  const alunoId = request.params.alunoId
  const voluntario = await voluntariosModel.findById(voluntarioId)
  const aluno = voluntario.alunos.find(voluntario => voluntario._id == alunoId)

  return response.status(200).send(aluno)
}


//POST
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

const addAluno = async (request, response) => {
  const voluntarioId = request.params.voluntarioId
  const aluno = request.body
  const options = { new: true }
  const novoAluno = new alunosModel(aluno)
  const voluntario = await voluntariosModel.findById(voluntarioId)

  voluntario.alunos.push(novoAluno)
  voluntario.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(voluntario)
  })
}

//PATCH
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

const atualizarAluno = (request, response) => {
  const voluntarioId = request.params.voluntarioId
  const alunoId = request.params.alunoId
  const options = { new: true }

  voluntariosModel.findOneAndUpdate(
    { _id: voluntarioId, 'alunos._id': alunoId },
    {
      $set: {
        'alunos.$.nome': request.body.nome,
        'alunos.$.materia': request.body.materia,
        'alunos.$.dificuldade': request.body.dificuldade
      }
    },
    options,
    (error, voluntario) => {
      if (error) {
        return response.status(500).send(error)
      }

      if (voluntario) {
        return response.status(200).send(voluntario)
      }

      return response.status(404).send('Voluntário não encontrado.')
    }
  )
}

// const conversorData = (dataString) => {
//   const dia = dataString.split("/")[0]
//   const mes = dataString.split("/")[1] - 1
//   const ano = dataString.split("/")[2]
//   const dataFormatada = new Date(ano, mes, dia)
//   return dataFormatada
// }

const atualizarAula = async (request, response) => {
  const voluntarioId = request.params.voluntarioId
  const alunoId = request.params.alunoId
  const options = { new: true }
  const voluntario = await voluntariosModel.findById(voluntarioId)
  const alunoEnc = voluntario.alunos.find((aluno) => alunoId == aluno._id)
  const data = request.body.dataAulas

  const novaData = new Date(data)

  alunoEnc.dataAulas.push(novaData)
 
  alunoEnc.save((error,aluno) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(aluno)
  })
  
}



//DELETE
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



module.exports = {
  getAll,
  getById,
  getAlunos,
  getAlunoById,
  add,
  addAluno,
  alterar,
  atualizarAluno,
  atualizarAula,
  remove,
  login
}