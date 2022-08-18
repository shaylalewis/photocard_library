const express = require('express')
const router = express.Router()
const Idol = require('../models/idol')

// All Idols Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const idols = await Idol.find(searchOptions)
        res.render('idols/index', {
            idols: idols,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Idol Route
router.get('/new', (req, res) => {
    res.render('idols/new', { idol: new Idol() })
})

// Create Idol Route
router.post('/', async (req, res) => {
    const idol = new Idol({
        name: req.body.name
    })
    try {
        const newIdol = await idol.save()
        // res.redirect(`idols/${newIdol.id}`)
        res.redirect(`idols`)
    } catch {
        res.render('idols/new', {
            idol: idol,
            errorMessage: 'Error creating Idol'
        })
    }
})

module.exports = router