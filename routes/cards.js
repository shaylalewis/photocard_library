const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Card = require('../models/card')
const Idol = require('../models/idol')
const { title } = require('process')
const uploadPath = path.join('public', Card.cardImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Cards Route
router.get('/', async (req, res) => {
  let query = Card.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.version != null && req.query.version != '') {
    query = query.regex('version', new RegExp(req.query.version, 'i'))
  }
  // if (req.query.idol != null && req.query.idol !== '') {
  //   query = query.regex('idol', new RegExp(req.query.idol, 'i'))
  // }
  try {
    const cards = await query.exec()
    res.render('cards/index', {
      cards: cards,
      searchOptions: req.query
    })
  } catch (err) {
    console.log(err)
    // res.redirect('/')
  }
})

// New Card Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Card())
})

// Create Card Route
router.post('/', upload.single('image'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const card = new Card({
    title: req.body.title,
    idol: req.body.idol,
    version: req.body.version,
    have: req.body.have,
    acquireDate: new Date(req.body.acquireDate),
    description: req.body.description,
    cardImageName: fileName
  })

  try {
    const newCard = await card.save()
    // res.redirect(`cards/${newCard.id}`)
    res.redirect(`cards`)
  } catch (err) {
    console.log(err)
    if (card.cardImageName != null) {
      removeCardImage(card.cardImageName)
    }
    renderNewPage(res, card, true)
  }
})

function removeCardImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

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
}

module.exports = router