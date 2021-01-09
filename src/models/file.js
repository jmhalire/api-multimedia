// app/models/document.js
// load the things we need
var { Schema, model } = require('mongoose');

// define the schema for our user model
var fileSchema = Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users' },
    id_bucket: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, default: '' },
    type: { type: String, required: true },
    ext: { type: String, required: true },
    size: { type: String, required: true }
}, {
    timestamps: true
});
module.exports = model('datefiles', fileSchema);