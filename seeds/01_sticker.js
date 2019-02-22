/* jshint esversion:6 */
const stickers = require("../data/stickers");

exports.seed = function(knex, Promise) {
    return knex('sticker').del()
        .then(function() {
            return knex('sticker').insert(stickers);
        });
};