'use strict';
var fs = require('fs');
/* // CARGANDO JSON
let rawdata = fs.readFileSync('student.json');
let student = JSON.parse(rawdata);
console.log(student);*/
// ESCRIBIR ARCHIVO JSON
module.exports = /** @class */ (function () {
    function json(data) {
        this.data = null;
        if (typeof data === 'undefined') {
            console.log("Error, no se distinguio data para escribir");
            return;
        }
        this.data = data;
    }
    json.prototype.save = function () {
        // Decodificar json
        var ddt = JSON.stringify(this.data);
        fs.writeFileSync('mproductid.json', ddt);
        console.log("Archivo Salvado.");
    };
    json.prototype.write = function (obj) {
        // Decodificar json
        var ddt = JSON.stringify(obj);
        fs.writeFileSync('newproduct.json', ddt);
        console.log("Archivo Salvado.");
    };
    json.prototype.load = function (file, resolve) {
        fs.readFile('src/' + file, function (err, data) {
            if (err)
                throw err;
            var dat = JSON.parse(data);
            return resolve(dat);
        });
    };
    return json;
}());
