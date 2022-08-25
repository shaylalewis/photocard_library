const express = require('express')
const router = express.Router()
const Idol = require('../models/idol')
const Card = require('../models/card')

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
        res.redirect(`idols/${newIdol.id}`)
    } catch {
        res.render('idols/new', {
            idol: idol,
            errorMessage: 'Error creating Idol'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const idol = await Idol.findById(req.params.id)
        const cards = await Card.find({ idol: idol.id }).limit(6).exec()
        res.render('idols/show', {
            idol: idol,
            cardsByIdol: cards
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const idol = await Idol.findById(req.params.id)
        res.render('idols/edit', { idol: idol })
    } catch {
        res.redirect('/idols')
    }
})

router.put('/:id', async (req, res) => {
    let idol
    try {
        idol = await Idol.findById(req.params.id)
        idol.name = req.body.name
        await idol.save()
        res.redirect(`/idols/${idol.id}`)
    } catch {
        if (idol == null) {
            res.redirect('/')
        } else {
            res.render('idols/edit', {
                idol: idol,
                errorMessage: 'Error updating Idol'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let idol
    try {
        idol = await Idol.findById(req.params.id)
        await idol.remove()
        res.redirect('/idols')
    } catch {
        if (idol == null) {
            res.redirect('/')
        } else {
            res.redirect(`/idols/${idol.id}`)
        }
    }
})

module.exports = router