const mongoose = require('mongoose')
const path = require('path')
mongoose.Schema.Types.String.checkRequired(v => typeof v === 'string');

const cardImageBasePath = 'uploads/cardImages'



const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    idol: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Idol'
    },
    version: {
        type: String
    },
    have: {
        type: String
    },
    acquireDate: {
        type: Date
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    cardImage: {
        type: Buffer,
        required: true
    },
    cardImageType: {
        type: String,
        required: true
    }
    // group: {
    //     type: String
    // }
})

cardSchema.virtual('cardImagePath').get(function () {
    if (this.cardImageName != null) {
        return path.join('/', cardImageBasePath, this.cardImageName)
    }
})

module.exports = mongoose.model('Card', cardSchema)
module.exports.cardImageBasePath = cardImageBasePath