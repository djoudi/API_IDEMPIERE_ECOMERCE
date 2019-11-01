'use strict'

const fs = require('fs');
/* // CARGANDO JSON 
let rawdata = fs.readFileSync('student.json');
let student = JSON.parse(rawdata);
console.log(student);*/

// ESCRIBIR ARCHIVO JSON
module.exports = class json {
    private data: object = null;

    constructor(
        data: object
    ) {
        if(typeof data === 'undefined') {
            console.log("Error, no se distinguio data para escribir");
            return;
        }
        this.data = data;        
    }

    public save() {
        // Decodificar json
        let ddt = JSON.stringify(this.data);
        fs.writeFileSync('mproductid.json', ddt);
        console.log("Archivo Salvado.");
    }

    public write(obj: object) {
        // Decodificar json
        let ddt = JSON.stringify(obj);
        fs.writeFileSync('newproduct.json', ddt);
        console.log("Archivo Salvado.");
    }

    public load(file: string, resolve) {
        fs.readFile('src/'+file, (err, data) => {
            if (err) throw err;
            let dat = JSON.parse(data);
            return resolve(dat);
        });
    }
}