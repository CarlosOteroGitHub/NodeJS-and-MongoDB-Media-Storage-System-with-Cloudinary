//Llamado del archivo donde se almacenan los modelos de la base de datos.
const User = require('../models/User');

//Función para listar todos los registros del modelo User de la base de datos MongoDB.
function index(req, res){
	User.find({}) //Sobre esta linea de codigo se especifica la paginación para mostrar los registros, en este caso se muestran 8 registros ordenados por el ID de manera descendente.
	.then(docs => {
		res.json(docs);
	}).catch(err => {
		res.json(err);
	});
}

//Función para insertar un registro en el modelo User de la base de datos MongoDB.
function create(req, res, next){
	User.create({
		email: req.body.email,
		name: req.body.name,
		admin: req.body.admin,
		password: req.body.password
	}).then(doc => {
		req.place = doc;
		next();
	}).catch(err => {
		next(err);
	});
}

module.exports = {index, create};