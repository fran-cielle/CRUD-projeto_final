const express = require('express');
const router = express.Router();
const controller = require("../controllers/VoluntariosController")
const jwt = require('jsonwebtoken')
const SEGREDO = process.env.SEGREDO

const autenticar = (request, response, next) => {
  const authHeader = request.get('authorization')
  let autenticado = false

  if (!authHeader) {
    return response.status(401).send('Você precisa fazer login!')
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, SEGREDO, (error, decoded) => {
    console.log(error,decoded,'AQUI')
    if (error) {
      autenticado = false
    } else {
      if (decoded.grupo == 'professor') {
        autenticado = true
      } else {
        autenticado = false
      }
     
    }
  })

  if (!autenticado) {
    return response.status(403).send('Acesso negado.')
  }

  next()
}

// const autenticarAdmin = (request, response, next) => {
//   const authHeader = request.get('authorization')
//   let autenticado = false

//   if (!authHeader) {
//     return response.status(401).send('Você precisa fazer login!')
//   }

//   const token = authHeader.split(' ')[1]

//   jwt.verify(token, SEGREDO, (error, decoded) => {
//     if (error) {
//       autenticado = false
//     } else {
//       if (decoded.grupo == 'admin') {
//         autenticado = true
//       } else {
//         autenticado = false
//       }
//     }
//   })

//   if (!autenticado) {
//     return response.status(403).send('Acesso negado.')
//   }

//   next()
// }

router.get('',autenticar, controller.getAll)
router.post ('', controller.add)
router.get('/:id', controller.getById)
router.get('/:id/aluno', controller.getAlunos)
router.get('/:voluntarioId/aluno/:alunoId', controller.getAlunoById)
router.patch('/:id', controller.alterar)
router.patch('/:voluntarioId/aluno/:alunoId', controller.atualizarAluno)
router.patch('/:voluntarioId/aula/:alunoId', controller.atualizarAula)
router.delete('/:id', controller.remove)
router.post('/:voluntarioId/aluno', controller.addAluno)
router.post('/login', controller.login)


module.exports = router
