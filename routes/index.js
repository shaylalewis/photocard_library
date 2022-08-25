const express = require('express')
const router = express.Router()
const Card = require('../models/card')

router.get('/', async (req, res) => {
    let cards
    try {
        cards = await Card.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        cards = []
    }
    res.render('index', { cards: cards })
})

module.exports = router