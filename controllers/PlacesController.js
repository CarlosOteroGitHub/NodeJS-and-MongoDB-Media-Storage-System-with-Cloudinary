//Llamado del archivo donde se almacenan los modelos de la base de datos.
const Place = require('../models/Place');
const upload = require('../config/upload');
const uploader = require('../models/uploader');

//Función Middleware utilizada para realizar las busquedas individuales al modelo Place mediante un ID. Aplica a las funciones show y delete (Para la función PUT no puesto que marca error).
function find(req, res, next){
	Place.findOne({slug: req.params.id})
	.then(place =>{
		req.place = place;
		next();
	}).catch(err =>{
		next(err);
	});
}

//Función para listar todos los registros del modelo Places de la base de datos MongoDB.
function index(req, res){
	Place.paginate({}, {page: req.query.page || 1 , limit: 8, sort: {'_id': -1}}) //Sobre esta linea de codigo se especifica la paginación para mostrar los registros, en este caso se muestran 8 registros ordenados por el ID de manera descendente.
	.then(docs => {
		res.json(docs);
	}).catch(err => {
		console.log(err);
		res.json(err);
	});
}

//Función para listar un registro de la base de datos MongoDB mediante un ID.
function show(req, res){
	res.json(req.place);
	/*
	CODIGO SIN LA FUNCIÓN MIDDLEWARE "find()" 
	Place.findById(req.params.id)
	.then(doc => {
		res.json(doc)
	}).catch(err => {
		console.log(err);
		res.json(err);
	})*/
}

//Función middleware para insertar un registro en el modelo Places de la base de datos MongoDB.
function create(req, res, next){
	Place.create({
		title: req.body.title,
		descripcion: req.body.descripcion,
		acceptsCreditCard: req.body.acceptsCreditCard,
		openHour: req.body.openHour,
		closeHour: req.body.closeHour
	}).then(doc => {
		req.place = doc;
		next();
	}).catch(err => {
		next(err);
	});
}

//Función para actualizar un registro de la base de datos MongoDB mediante un ID.
function update(req, res){
	let attributes = ['title','descripcion','acceptsCreditCard','openHour','closeHour'];
	let placeParams = {};
	attributes.forEach(attr => {
		if(Object.prototype.hasOwnProperty.call(req.body, attr))
			placeParams[attr] = req.body[attr];
	})

	Place.findOneAndUpdate({'slug': req.params.id}, placeParams, {new: true})
	.then(doc => {
		res.json(doc)
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
}

//Función para eliminar un registro de la base de datos MongoDB mediante un ID.
function destroy(req, res){
	req.place.remove()
	.then(doc => {
		res.json({});
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
}

//Función middleware que retorna una colección de imagenes para almacenar internamente archivos en la carpeta "uploads", en el modelo Places los nombres de la imagen se guardarn en las columnas "avatarImage" y "coverImage" respectivamente. 
function multerMiddleware(){
	return upload.fields([
		{name: 'avatar', maxCount: 1},
		{name: 'cover', maxCount: 1}
	]);
}

//Función que permite subir a la nube, especificamente en cloudinary documentos multimedia.
function saveImage(req, res){
	if(req.place){
		const files = ['avatar', 'cover'];
		const promises = [];

		files.forEach(imageType =>{
			if(req.files && req.files[imageType]){
				const path = req.files[imageType][0].path;
				promises.push(req.place.updateImage(path, imageType));
			}
		})

		Promise.all(promises)
		.then(results =>{
			console.log(results);
			res.json(req.place);
		}).catch(err => {
			console.log(err);
			res.json(err);
		});
	} else {
		res.status(422).json({
			error: req.error || 'Could no save place'
		});
	}
}

module.exports = {find, index, show, create, update, destroy, multerMiddleware, saveImage};