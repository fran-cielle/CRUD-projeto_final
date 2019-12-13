const express = require('express');
const router = express.Router();
const controller = require("../controllers/VoluntariosController")


router.get('',controller.getAll)
router.post ('', controller.add)
// router.patch('/:id', controller)
// router.delete('/:id', controller)


module.exports = router
