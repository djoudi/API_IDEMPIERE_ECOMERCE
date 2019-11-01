'use strict';
var mysql = require('mysql2/promise');
const { Pool } = require('pg');

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
        this.postgres = new Pool({
            host: 'local.gzserver',
            user: 'usuario',
            password: 'clave',
            database: 'basededatos',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    }
    database.prototype.getProducts = function (b) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.postgres.connect( (err, client, release) => {
                if(err) return console.log("Error adquiring client: ", err.stack);

                client.query(`
                SELECT 
    --po.ad_org_id,
    --p.m_product_id,
 
    --p.sku,
    concat(p.name, ' - ', p.sku) as item_name,
    --p.c_uom_id,
    --p.isecommerce,
    /*COALESCE(sum(m.qtyonhand), 0::numeric) AS qtyonhand,
    COALESCE(sum(m.qtyordered), 0::numeric) AS qtyordered,
    COALESCE(sum(m.qtyonhand), 0::numeric) - COALESCE(b_route.qty, 0::numeric) - COALESCE(m_pagos.qty, 0::double precision)::numeric - COALESCE(wait.qtywait, 0::numeric) AS qtyavailable,
    COALESCE(wait.qtywait, 0::numeric) AS bsca_qtywait,
    COALESCE(b_route.qty, 0::numeric) + COALESCE(m_pagos.qty, 0::double precision)::numeric AS bsca_salesline,
    ctx.name AS impuesto,*/
    --p.c_taxcategory_id,
    --pri.pricelist_l AS pricelist,
    p.shortname as item_description,
    ( SELECT
                CASE
                    WHEN p.c_taxcategory_id = 6000019::numeric THEN pri.pricelist_l * 1.08
                    WHEN p.c_taxcategory_id = 6000022::numeric THEN pri.pricelist_l * 1.16
                    ELSE pri.pricelist_l
                END AS pricelist) as price

      
     
   FROM m_product p
     LEFT JOIN bsca_productorg po ON p.m_product_id = po.m_product_id
     LEFT JOIN m_storage m ON po.m_product_id = m.m_product_id AND m.ad_org_id = po.ad_org_id
     LEFT JOIN m_locator l ON m.m_locator_id = l.m_locator_id
    
     left join   
     (select (SELECT pricelist FROM m_productprice pp where
     pp.m_product_id=po3.m_product_id AND pp.ad_org_id=po3.ad_org_id 
     order by pp.updated desc limit 1)as pricelist_l, po3.ad_org_id, po3.m_product_ID from m_product p3
     join bsca_productorg po3 ON p3.m_product_id = po3.m_product_id) 
     as  pri on  pri.ad_org_id = po.ad_org_id and p.m_product_id = pri.m_product_id
     
     
     LEFT JOIN m_warehouse w ON w.m_warehouse_id = l.m_warehouse_id
     LEFT JOIN c_taxcategory ctx ON ctx.c_taxcategory_id = p.c_taxcategory_id
     LEFT JOIN ( SELECT COALESCE(sum(
                CASE
                    WHEN o.c_doctypetarget_id = 1000300::numeric THEN ol.qtyordered
                    WHEN o.c_doctypetarget_id = 1000301::numeric THEN ol.qtyordered * (-1)::numeric
                    ELSE 0::numeric
                END), 0::numeric) AS qty,
            ol.m_product_id,
            o.ad_org_id
           FROM c_order o
             JOIN c_orderline ol ON o.c_order_id = ol.c_order_id
             JOIN bsca_route br ON o.bsca_route_id = br.bsca_route_id
          WHERE (o.c_doctypetarget_id = ANY (ARRAY[1000300::numeric, 1000301::numeric])) AND br.docstatus::text = 'DR'::text AND NOT (br.bsca_route_id IN ( SELECT ro.bsca_route_id
                   FROM bsca_routeout ro))
          GROUP BY o.ad_org_id, ol.m_product_id) b_route ON b_route.m_product_id = p.m_product_id AND b_route.ad_org_id = po.ad_org_id
     LEFT JOIN ( SELECT COALESCE(sum(mt.cantidad), 0::double precision) AS qty,
            p_1.m_product_id,
            a.ad_org_id
           FROM ma_pagos mp
             JOIN ma_transaccion mt ON mt.c_numero::text = mp.c_numero::text
             JOIN m_product p_1 ON p_1.sku::text = mt.cod_principal::text
             JOIN ad_org a ON a.value::text = mp.c_sucursal::text
          WHERE mp.bsca_isimported = false
          GROUP BY a.ad_org_id, p_1.m_product_id) m_pagos ON m_pagos.m_product_id = p.m_product_id AND 
          m_pagos.ad_org_id = po.ad_org_id
     LEFT JOIN ( SELECT COALESCE(sum(r.qtywait), 0::numeric) AS qtywait,
            r.m_product_id,
            r.ad_org_id
           FROM bsca_routeoutwait r
          GROUP BY r.ad_org_id, r.m_product_id) wait ON wait.m_product_id = p.m_product_id AND 
          wait.ad_org_id = po.ad_org_id
where po.ad_org_id=1000004 and p.isecommerce != 'N' --and p.m_product_id=1002767 --p.sku='000403'
  GROUP BY po.ad_org_id, p.m_product_id, b_route.qty, m_pagos.qty, wait.qtywait, p.ad_client_id, p.created,
 p.createdby, p.updated, p.updatedby,p.isecommerce,  pri.pricelist_l, ctx.name
                `, (err, result) => {
                    release();
                    if(err) return console.log("Error executing query", err.stack);

                    // Conexion exitosa
                    console.log(result.rows.length);
                    if (result.rows.length > 0) {
                        return resolve(result.rows);
                    }
                    else {
                        return reject();
                    }
                })
            })
        });
    }
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
