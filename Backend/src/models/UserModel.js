const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    "name": {type: String, required: true},
    "email": {type: String, required: true},
    "password": {type: String, required: true},
    "owned_documents": {type: Array, required: false},
    "shared_with_me_documents": {type: Array, required: false}
})

module.exports = model('Users', UserSchema);