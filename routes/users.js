//Llamado de librerias externas.
var express = require('express');
let router = express.Router();

//Llamado del archivo controlador con las funciones CRUD asignadas a cada petición HTTP.
const usersController = require('../controllers/UsersController');

//Rutas que realizan busquedas generales (index y create).
router.route('/')
	//Petición HTTP GET para obtener todos los registros del modelo Places.
	.get(usersController.index)
	//Petición HTTP POST para insertar un registro en el modelo User.
	.post(usersController.create)

module.exports = router;
