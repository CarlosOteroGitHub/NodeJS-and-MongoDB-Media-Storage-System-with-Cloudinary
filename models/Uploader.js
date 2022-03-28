//Llamado de librerias externas.
const cloudinary = require('cloudinary');

//Llamado de las especificaciones de conexión a servicio de cloudinary.
const secrets = require('../config/secrets');

//Instrucciones para subir documentos a servicio de cloudinary.
cloudinary.config(secrets.cloudinary);
module.exports = function(imagePath){
	return new Promise((resolve, reject) =>{
		cloudinary.uploader.upload(imagePath, function(result){
			console.log(result);
			if(result.secure_url)
				return resolve(result.secure_url);
			reject(new Error('Error with cloudinary'));
		})
	})
}