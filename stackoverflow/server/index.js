const express = require('express')
const app = express()
const cors = require('cors') //read about cors
const Tag = require('./models/tag.model')

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/stack-overflow')

const userRouter = require('./routers/user')
const questionRouter = require('./routers/question')

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(questionRouter)

app.get('/tags', async (req, res) => {
    try {
		const tags = await Tag.find()
		return res.json({ status: 'ok', tags })
	} catch (error) {
		res.json({ status: 'error', error })
	}
})

app.listen(1337, () => {
    console.log('Server has started')
})