const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const alunosSchema = new Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  nome: { type: String, required: true },
  materia: { type: String, required: true },
  nivel: { type: Number }
})

const alunosModel = mongoose.model('alunos', alunosSchema);

module.exports = { alunosModel, alunosSchema };
