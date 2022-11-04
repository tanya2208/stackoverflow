const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        surname: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        nickname: {type: String},
        position: {type: String},
        experience: {type: Number},
        stack: {type: Array, default: void 0},
        rating: {
            questions: {type: Number},
            answers: {type: Number},
            liked: {type: Number},
            accepted: {type: Number}
        },
        tokens: [{ token : {type: String, required: true}}]
    },
    {collection: 'user-data'}
)

userSchema.virtual('questions', {
    ref: 'QuestionData',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, 'thisissecretkey')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async ({email, password}) => {
    const user = await User.findOne({email: email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('UserData', userSchema)

module.exports = User