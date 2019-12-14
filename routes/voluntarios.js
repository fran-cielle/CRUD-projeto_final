const express = require('express');
const router = express.Router();
const controller = require("../controllers/VoluntariosController")


router.get('',controller.getAll)
router.post ('', controller.add)
router.patch('/:id', controller.alterar)
//router.delete('/:id', controller)


module.exports = router
