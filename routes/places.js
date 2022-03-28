//Llamado de librerias externas.
var express = require('express');
let router = express.Router();

//Llamado del archivo controlador con las funciones CRUD asignadas a cada petición HTTP.
const placesController = require('../controllers/PlacesController')

//Rutas que realizan busquedas generales (index, create).
router.route('/')
	//Petición HTTP GET para obtener todos los registros del modelo Places.
	.get(placesController.index)
	//Petición HTTP POST para insertar un registro en el modelo Places.
	.post(placesController.multerMiddleware(), placesController.create, placesController.saveImage)

//Rutas que realizan una busqueda individual mediante ID, empleando un Middleware (show y destroy).
router.route('/:id')
	//Petición HTTP GET para obtener los datos de un registro del modelo Places por medio del ID.
	.get(placesController.find, placesController.show)
	//Petición HTTP PUT para actualizar un registro en el modelo Places mediante su ID.
	.put(placesController.update)
	//Petición HTTP DELETE para eliminar un registro en el modelo Places mediante su ID.
	.delete(placesController.find, placesController.destroy)

module.exports = router;