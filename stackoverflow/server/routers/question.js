const express = require('express')
const Question = require('../models/question.model')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const router = new express.Router()

router.post('/questions', auth, async (req, res) => {
    try{
        const question = await Question.create({
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            user: req.user._id,
            lastActiveAt: new Date()
        })
        return res.json({status: 'ok', question: question})
    } catch(err){
        res.json({status : 'error', error : err})
    }
})

router.get('/questions/:id', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
		const question = await Question.findById(req.params.id)
        let access = false
        if(token){
            const decoded = jwt.verify(token, 'thisissecretkey')
		    const id = decoded._id
            if(id === question.user.toString()){
                access = true
            }
        }
		return res.json({ status: 'ok', question , access })
	} catch (error) {
		res.json({ status: 'error', error: 'invalid token' })
	}
})

router.post('/questions/filtered', async (req, res) => {
    try {
        let query = {}
        if(req.body.title !== 'null'){
            query['title'] = { "$regex": req.body.title, "$options": "i" }
        }
        if(req.body.tags !== 'null'){
            query['tags'] = { $all: JSON.parse(req.body.tags) }
        }
        const questions = await Question.find(query).sort({lastActiveAt: -1}).populate('user')
		return res.json({ status: 'ok', questions: questions })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error })
	}
})

router.post('/questions/:id/answer', auth, async (req, res) => {
    try {
        const answer = req.body.answer
        const question = await Question.findById(req.params.id)
        question.answers.push({
            answer,
            rating: 0,
            user: req.user._id
        })
        question.lastActiveAt = new Date()
        await question.save()
        return res.json({ status: 'ok', question })
    } catch (error) {
        res.json({ status: 'error', error })
    }
})

module.exports = router