/* jshint esversion:6 */

//
const knex = require('./knex'); //Conexión
module.exports = {
    getAll() {
        return knex('sticker');
    }
};