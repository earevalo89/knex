/* jshint esversion:6 */
const knex = require('../db/knex');

describe('CRUD Stickers', () => {
    before(() => {
        //run migrations
        knex.migrate.latest()
            .then(() => {
                return knex.seed.run();
            });
        //run seeds
    });
});