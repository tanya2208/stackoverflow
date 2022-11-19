const express = require('express')
const User = require('../models/user.model')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const router = new express.Router()

router.post('/users/register', async (req, res) => {
    try{
        const user = await User.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            nickname: req.body.nickname,
            position: req.body.position,
            experience: req.body.experience,
            stack: req.body.stack,
            rating: req.body.rating
        })
        const token = await user.generateAuthToken()
        return res.json({status: 'ok', token})
    } catch(error){
        res.json({status : 'error', error})
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials({email: req.body.email, password: req.body.password,})
        const token = await user.generateAuthToken()
        return res.json({status: 'ok', token})
    } catch(error){
        return res.json({status: 'error', error})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()

        return res.json({status: 'ok'})
    } catch(error){
        return res.json({status: 500})
    }
})

router.get('/users/:id', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
		const user = await User.findById(req.params.id)
        let access = false
        if(token){
            const decoded = jwt.verify(token, 'thisissecretkey')
		    const id = decoded._id
            if(id === req.params.id){
                access = true
            }
        }
		return res.json({ status: 'ok', user: user, access })
	} catch (error) {
		res.json({ status: 'error', error })
	}
})

router.post('/users/update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        user.rating.overall = calculateRating(user)
        await user.save()
        return res.json({ status: 'ok', user: user })
    } catch (error) {
        res.json({ status: 'error', error })
    }
})

router.post('/users/updateRating/:id', async (req, res) => {
    const update = req.body.field
    try {
        const user = await User.findById(req.params.id)
        if(req.body.answerRating){
            if(req.body.answerRating == 0){
                user.rating[update] = parseInt(user.rating[update])+1
            } else return
        } 
        user.rating[update] = parseInt(user.rating[update])+1
        // RATING
        user.rating.overall = calculateRating(user)
        await user.save()
        return res.json({ status: 'ok', user: user })
    } catch (error) {
        res.json({ status: 'error', error })
    }
})

function calculateRating(user){
    let rating = 0;
    rating= 0.5 * user.rating.questions + user.rating.answers + 5 * user.rating.liked + 10 * user.rating.accepted;
    if(user.experience > 0 && user.experience <= 2 || user.position.toLowerCase().contains('junior')){
        rating += 10
    } else if(user.experience > 2 && user.experience <= 4 || user.position.toLowerCase().contains('middle')) {
        rating += 50
    } else if(user.experience > 4 || user.position.toLowerCase().contains('senior')) {
        rating += 100
    }
    return rating
}

router.get('/users/:id/questions', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        await user.populate('questions')
        if(user.questions){
            return res.json({ status: 'ok', questions: user.questions })
        }
    } catch(error) {
        console.log(error)
        res.json({ status: 'error', error })
    }
	
})

module.exports = router