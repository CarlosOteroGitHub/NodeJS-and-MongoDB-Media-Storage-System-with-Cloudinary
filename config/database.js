//Llamado de librerias externas.
const mongoose = require('mongoose');

//Proceso para exportar conexión y creación a base de datos MongoDB.
const dbName = 'places_api_rest';

module.exports = {
	connect: () => mongoose.connect('mongodb://localhost/' + dbName), 
	dbName,
	connection: ()=> {
		if(mongoose.connection)
			return mongoose.connection;
		return this.connect();
	}
}