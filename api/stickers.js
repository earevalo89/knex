/* jshint esversion:6 */

const express = require('express');
const router = express.Router();

const queries = require('../db/queries');

router.get('/', (req, res) => {
    /*
    res.json({
        message: '☑'
    });
    */
    queries.getAll().then(stickers => {
        res.json(stickers);
    });
});

module.exports = router;