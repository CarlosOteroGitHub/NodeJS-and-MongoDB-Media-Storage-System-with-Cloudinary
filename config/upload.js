//Llamado de librerias externas.
const multer = require('multer');

//Proceso que define la ruta donde seran almacenadas las imagenes internamente, en este caso es dentro de la carpeta "uploads"
module.exports = multer({dest: 'uploads/'});