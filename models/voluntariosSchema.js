const mongoose = require('mongoose');
const { alunosSchema } = require('./alunosSchema')
const Schema = mongoose.Schema;
const VoluntariosSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  nome: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  foto: { type: String, required: true },
  materia: [{ type: String, required: true }],
  alunos: [alunosSchema],
  senha: { type: String, required: true },
  grupo: { type: String }
})

const voluntariosModel = mongoose.model('voluntarios', VoluntariosSchema);

module.exports = voluntariosModel;