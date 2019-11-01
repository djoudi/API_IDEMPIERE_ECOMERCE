var express = require('express');
var path = require('path');
var mt = process.argv.slice(1);
// Modulos
var api = require('./modules/api');
// initialization
var app = express();
//settings
app.set('port', process.env.PORT || 3000);
//middlewares
// static files
app.use(express.static(path.join(__dirname, 'public')));
// starting the server
app.listen(app.get('port'), function () {
    console.log("Server inciado.");
    // Generando Reporte DataViewGrip
    var API = new api;
    API.getData(0, mt, function (resolve) {
        console.log("Archivo generado con exito.");
    });
});
