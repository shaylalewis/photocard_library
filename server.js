if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')


const indexRouter = require('./routes/index')
const idolRouter = require('./routes/idols')
const cardRouter = require('./routes/cards')
const groupRouter = require('./routes/groups')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', () => console.log('connected to mongoose'))


app.use('/', indexRouter)
app.use('/idols', idolRouter)
app.use('/cards', cardRouter)
app.use('/groups', groupRouter)

app.listen(process.env.PORT || 3000)