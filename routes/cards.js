const express = require('express')
const router = express.Router()
const Card = require('../models/card')
const Idol = require('../models/idol')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Cards Route
router.get('/', async (req, res) => {
  let query = Card.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.version != null && req.query.version != '') {
    query = query.regex('version', new RegExp(req.query.version, 'i'))
  }
  // if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
  //   query = query.gte('publishDate', req.query.publishedAfter)
  // }
  try {
    const cards = await query.exec()
    res.render('cards/index', {
      cards: cards,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Card Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Card())
})

// Create Card Route
router.post('/', async (req, res) => {
  const card = new Card({
    title: req.body.title,
    idol: req.body.idol,
    version: req.body.version,
    have: req.body.have,
    acquireDate: new Date(req.body.acquireDate),
    description: req.body.description
  })
  saveCardImg(card, req.body.cover)

  try {
    const newCard = await card.save()
    res.redirect(`cards`)
    // res.redirect(`cards/${newCard.id}`)
  } catch (err) {
    console.log(err)
    // renderNewPage(res, card, true)
  }
})


async function renderNewPage(res, card, hasError = false) {
  try {
    const idols = await Idol.find({})
    const params = {
      idols: idols,
      card: card
    }
    if (hasError) params.errorMessage = 'Error Creating Card'
    res.render('cards/new', params)
  } catch {
    res.redirect('/cards')
  }
  // renderFormPage(res, card, 'new', hasError)
}

function saveCardImg(card, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    card.cardImage = new Buffer.from(cover.data, 'base64')
    card.cardImageType = cover.type
  }
}

module.exports = router