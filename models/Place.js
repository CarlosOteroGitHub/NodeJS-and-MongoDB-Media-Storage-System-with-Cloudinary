//Llamado de librerias externas.
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const uploader = require('./uploader');
const slugify = require('../plugins/slugify');

//Estructrua del modelo/colección Places.
let placeSchema = new mongoose.Schema({
	title: {
		type: String	
	},

	address: {
		type: String
	},

	descripcion: {
		type: String
	},

	acceptsCreditCard: {
		type: Boolean,
		default: false
	},

	coverImage: {
		type: String
	},

	avatarImage: {
		type: String
	},

	openHour: {
		type: Number
	},

	closeHour: {
		type: Number
	},

	slug: {
		type: String,
		unique: true
	}
});

//Inclusión del plugin de Mongoose para paginar registros.
placeSchema.plugin(mongoosePaginate);

//Función encargada de subir la imagen y guardar el lugar.
placeSchema.methods.updateImage = function(path, imageType){
	return uploader(path)
		.then(secure_url => this.saveImageUrl(secure_url, imageType));
}

//Función encargada de guardar la imagen en la base de datos.
placeSchema.methods.saveImageUrl = function(secure_url, imageType){
	this[imageType + 'Image'] = secure_url;
	return this.save();
}

//Función Hook que se ejecuta antes de realizar cualquier operación de guardado en la base de datos y lo que hace es generar una cadena siguiendo las reglas de remplazo especificadas en el archivo "slugify" para el campo slug.
placeSchema.pre('save', function(next){
	if(this.slug){
		return next();
	}
	generateSlugAndContinue.call(this, 0, next);
});

//Función que valida que exista un unico nombre por cada registro almacenado en el modelo Place para la columna "slug" Si retorna true se agrega la secuencia de número que le sigue.
placeSchema.statics.validateSlugCount = function(slug){
	return Place.count({slug: slug})
		.then(count =>{
			if(count > 0){
				return false;
			} else {
				return true;
			}
	})
}

//Función recursiva encargada de generar un slug distinto a los demás. Agregando al final la expresion: [nombre_slug] - numero de repetición.
function generateSlugAndContinue(count, next){
	this.slug = slugify(this.title);
	if(count != 0){
		this.slug = this.slug + "-" + count;
	}

	Place.validateSlugCount(this.slug)
		.then(isValid => {
			if(!isValid){
				return generateSlugAndContinue.call(this, count+1, next);
			}
			next();
	})
}

let Place = mongoose.model('Place', placeSchema);

module.exports = Place;