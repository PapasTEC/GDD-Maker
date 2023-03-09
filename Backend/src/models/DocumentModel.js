const {Schema, model} = require('mongoose');

const DocumentSchema = new Schema({
    // id: {type: String, required: true},  mongo ya genera una llave unica para cada elemento
    "owner": {type: String, required: true},
    "lastUpdated": {type: Date, required: true},
    "titleInfo": {
        "title": { type: String, required: true},
        "imageUrl": {type: String, required: true},
    },
    "docText": [{
        "title": {type: String, required: true},
        "text": {type: String, required: true},
    }],
})

module.exports = model('Documents', DocumentSchema);