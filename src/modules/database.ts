'use strict'

//import { connect } from "net";

const mysql = require('mysql2/promise');

module.exports = class database {
    public secure: object = {
        tcp: 'local.gzserver',
        user: 'root',
        password: 'HT3dcwb728!*',
        dbna: 'game'
    };

    private connection: any = mysql.createPool({
        connectionLimit: 100,
        host: this.secure['tcp'],
        user: this.secure['user'],
        password: this.secure['password'],
        database: this.secure['dbna']
    });

    public hola() {
        console.log("hola mundo");
    }

    public getAcc(player: number) {
        var self = this;
        return new Promise( function(resolve, reject) {
            // Validando conexion mysql
            self.connection.getConnection().then( conn => {
                // generando llamado script
                conn.query("SELECT 7 as merchant_id, concat(game_id, ' - ', gold) as item_name, concat(gold, ' Disponibles') as item_description, cash as price FROM users WHERE 'unlock' = ?", [player])
                .then( rows => {
                    conn.release();
                    if(rows[0].length > 0) {
                        return resolve(rows);
                    } else {
                        return reject();
                    }
                });
            });
        });
    }
    
}