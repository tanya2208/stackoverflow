const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
    },
    {collection: 'tags-data'}
)

const Tag = mongoose.model('TagData', userSchema)

module.exports = Tag