const mongoose = require('mongoose')

const idolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Group'
    }
})

module.exports = mongoose.model('Idol', idolSchema)