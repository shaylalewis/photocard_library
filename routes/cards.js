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
    res.redirect(`cards/${newCard.id}`)
  } catch (err) {
    console.log(err)
    // renderNewPage(res, card, true)
  }
})

// Show Card Route
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate('idol')
      .exec()
    res.render('cards/show', { card: card })
  } catch {
    res.redirect('/')
  }
})

// Edit Card Route
router.get('/:id/edit', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
    renderEditPage(res, card)
  } catch {
    res.redirect('/')
  }
})

// Update Card Route
router.put('/:id', async (req, res) => {
  let card

  try {
    card = await Card.findById(req.params.id)
    card.title = req.body.title
    card.idol = req.body.idol
    card.version = req.body.version
    card.have = req.body.have
    card.acquireDate = new Date(req.body.acquireDate)
    card.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(card, req.body.cover)
    }
    await card.save()
    res.redirect(`/cards/${card.id}`)
  } catch {
    if (card != null) {
      renderEditPage(res, card, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Card Page
router.delete('/:id', async (req, res) => {
  let card
  try {
    card = await Card.findById(req.params.id)
    await card.remove()
    res.redirect('/cards')
  } catch {
    if (card != null) {
      res.render('cards/show', {
        card: card,
        errorMessage: 'Could not remove card'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, card, hasError = false) {
  renderFormPage(res, card, 'new', hasError)
}

async function renderEditPage(res, card, hasError = false) {
  renderFormPage(res, card, 'edit', hasError)
}

async function renderFormPage(res, card, form, hasError = false) {
  try {
    const idols = await Idol.find({})
    const params = {
      idols: idols,
      card: card
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Card'
      } else {
        params.errorMessage = 'Error Creating Card'
      }
    }
    res.render(`cards/${form}`, params)
  } catch {
    res.redirect('/cards')
  }
}

function saveCardImg(card, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    card.coverImage = new Buffer.from(cover.data, 'base64')
    card.coverImageType = cover.type
  }
}

module.exports = router