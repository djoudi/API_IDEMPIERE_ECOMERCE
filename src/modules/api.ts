'use strict'
const database = require('./database');
const log = require('./log');

module.exports = class matchserver {
    private data: {};

    constructor() {}

    getData(player: number, update: String[], _callback){
        // Creando objeto de conexon
        var vad = new database;

        // Verificando si se hara actualizacion
        if(!update[0]) return false;        

        // LLamando select a la db
        vad.getAcc(player).then( (result, err) => {
            if(err) return console.log("error");

            console.log("Datos de Retorno:", result[0].length);
            var lg = new log(result[0]);
            var matriz: object = null;
            var item: object = null;

            lg.load("item.json", resolve => {
                item = resolve;
            });

            lg.load("schema.json", resolve => {
                matriz = resolve; 

                // Agregando items
                for(var i = 0; i<result[0].length; i++) {
                    matriz["item"].push({
                        "item_id":i,
                        "merchant_id":"7",
                        "item_name":result[0][i].item_name,
                        "item_description":result[0][i].item_description+"\u00a0",
                        "status":"publish",
                        "category":"[\"251\"]",
                        "price":"{\"326\":\result[0][i].price\"\"}",
                        "addon_item":"",
                        "cooking_ref":"",
                        "discount":"",
                        "multi_option":"{\"129\":[\"one\"]}",
                        "multi_option_value":"{\"129\":[\"\"]}",
                        "photo":result[0][i].photo_url,
                        "sequence":"0",
                        "is_featured":"",
                        "date_created":"2019-07-10 12:56:56",
                        "date_modified":"2019-10-29 10:44:20",
                        "ip_address":"127.0.0.1",
                        "ingredients":"",
                        "spicydish":"0",
                        "two_flavors":"0",
                        "two_flavors_position":"{\"129\":[\"\"]}",
                        "require_addon":"",
                        "dish":"",
                        "item_name_trans":null,
                        "item_description_trans":null,
                        "non_taxable":"2",
                        "not_available":"1",
                        "gallery_photo":"",
                        "points_earned":"0",
                        "points_disabled":"1",
                        "packaging_fee":"0.0000",
                        "packaging_incremental":"0",
                        "ext_prod_code":null
                    });
                }

                // Salvando JSON
                lg.write(matriz);
                return _callback();
            });

        })
    }
}