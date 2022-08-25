const mongoose = require('mongoose')

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
    if (this.cardImage != null && this.cardImageType != null) {
        return `data:${this.cardImageType};charset=utf-8;base64,${this.cardImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Card', cardSchema)
