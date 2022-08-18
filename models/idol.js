const mongoose = require('mongoose')

const idolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    group: {
        type: String
    }
})

module.exports = mongoose.model('Idol', idolSchema)