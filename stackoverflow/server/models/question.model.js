const mongoose = require('mongoose')

const AnswerSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserData'},
    answer: {type: String, required: true},
    rating: Number,
});

const questionSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        tags: {type: Array, default: void 0},
        user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserData'},
        answers: {type :[AnswerSchema], required: false},
        lastActiveAt: {type: Date, required: true}
    },
    {collection: 'question-data'}
)

const Question = mongoose.model('QuestionData', questionSchema)

module.exports = Question