'use strict';
//import { connect } from "net";
var mysql = require('mysql2/promise');
module.exports = /** @class */ (function () {
    function database() {
        this.secure = {
            tcp: 'local.gzserver',
            user: 'root',
            password: 'HT3dcwb728!*',
            dbna: 'game'
        };
        this.connection = mysql.createPool({
            connectionLimit: 100,
            host: this.secure['tcp'],
            user: this.secure['user'],
            password: this.secure['password'],
            database: this.secure['dbna']
        });
    }
    database.prototype.hola = function () {
        console.log("hola mundo");
    };
    database.prototype.getAcc = function (player) {
        var self = this;
        return new Promise(function (resolve, reject) {
            // Validando conexion mysql
            self.connection.getConnection().then(function (conn) {
                // generando llamado script
                conn.query("SELECT 7 as merchant_id, concat(game_id, ' - ', gold) as item_name, concat(gold, ' Disponibles') as item_description, cash as price FROM users WHERE 'unlock' = ?", [player])
                    .then(function (rows) {
                    conn.release();
                    if (rows[0].length > 0) {
                        return resolve(rows);
                    }
                    else {
                        return reject();
                    }
                });
            });
        });
    };
    return database;
}());
