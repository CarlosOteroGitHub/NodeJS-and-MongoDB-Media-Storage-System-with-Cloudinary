var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('pagina principal');
});

module.exports = router;
