const { connect } = require('../models/Repository')
const voluntariosModel = require('../models/VoluntariosSchema')
const { alunosModel } = require('../models/alunosSchema')
const bcrypt = require('bcryptjs')

//const jwt = require('jsonwebtoken')

connect()

// const login = async (request, response) => {
//   const voluntarioEncontrado = await voluntariosModel.findOne({ email: request.body.email })

//   if (voluntarioEncontrado) {
//     const senhaCorreta = bcrypt.compareSync(request.body.senha, voluntarioEncontrado.senha)

//     if (senhaCorreta) {
//       const token = jwt.sign(
//         {
//           grupo: voluntarioEncontrado.grupo
//         },
//         SEGREDO,
//         { expiresIn: 6000 }
//       )

//       return response.status(200).send({ token })
//     }

//     return response.status(401).send('Senha incorreta.')
//   }

//   return response.status(404).send('Voluntario não encontrado.')
// }

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
  const treinador = await voluntariosModel.findById(voluntarioId)

  treinador.alunos.push(novoAluno)
  treinador.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(treinador)
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
        'alunos.$.dificuldade': request.body.dificuldade,
        'alunos.$.qtdAulas': request.body.qtdAulas
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
  add,
  addAluno,
  alterar,
  atualizarAluno,
  remove
  //login
}