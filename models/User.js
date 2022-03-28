//Llamado de librerias externas.
const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');

//Estructrua del modelo/colección User.
let userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true	
	},

	name: {
		type: String	
	},

	admin: {
		type: Boolean,
		default: false
	}
});

//Inclusión del plugin de Mongoose para encriptar datos.
userSchema.plugin(mongooseBcrypt);

let User = mongoose.model('User', userSchema);

module.exports = User;