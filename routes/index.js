const express = require('express')
const router = express.Router()
const Card = require('../models/card')

router.get('/', async (req, res) => {
    let cards
    try {
        cards = await Card.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch (error) {
        cards = []
    }
    res.render('index', { cards: cards })
})

module.exports = router