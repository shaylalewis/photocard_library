const express = require('express')
const router = express.Router()
const Group = require('../models/group')

// All Groups Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const groups = await Group.find(searchOptions)
        res.render('groups/index', {
            groups: groups,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Group Route
router.get('/new', (req, res) => {
    res.render('groups/new', { group: new Group() })
})

// Create Group Route
router.post('/', async (req, res) => {
    const group = new Group({
        name: req.body.name
    })
    try {
        const newGroup = await group.save()
        // res.redirect(`idols/${newIdol.id}`)
        res.redirect(`groups`)
    } catch (err) {
        console.log(err)
        res.render('groups/new', {
            group: group,
            errorMessage: 'Error creating Group'
        })
    }
})

module.exports = router