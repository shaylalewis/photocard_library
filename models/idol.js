const mongoose = require('mongoose')
const Card = require('./card')

const idolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

idolSchema.pre('remove', function (next) {
    Card.find({ idol: this.id }, (err, cards) => {
        if (err) {
            next(err)
        } else if (cards.length > 0) {
            next(new Error('This idol has cards still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Idol', idolSchema)