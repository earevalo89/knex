/* jshint esversion:6 */

const enviroment = process.env.NODE_ENV || 'development';
console.log("enviroment: " + enviroment);
const config = require('../knexfile');
const enviromentConfig = config[enviroment];
const knex = require('knex');
const connection = knex(enviromentConfig);

module.exports = connection;