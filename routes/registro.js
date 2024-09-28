var express = require("express");
var router = express.Router();
let Registro = require('../models/Registro');
const registroController = require('../controllers/registroController')

//registro
router.post('/', registroController.crearRegistro);
router.get('/', registroController.obtenerRegistros);
router.put('/:id', registroController.actualizarRegistro);
router.get('/:id', registroController.obtenerRegistro);
router.delete('/:id', registroController.eliminarRegistro);


module.exports = router;
