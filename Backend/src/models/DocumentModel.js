const {Schema, model} = require('mongoose');

const DocumentSchema = new Schema({
    // id: {type: String, required: true},  mongo ya genera una llave unica para cada elemento
    "owner": {type: String, required: true},
    "invited": {type: [String], required: true},
    "codeReadOnly": {type: String, required: true},
    "frontPage": {
        "documentTitle": {type: String, required: true},
        "documentLogo": {type: String, required: true},
        "companyName": {type: String, required: true},
        "companyLogo": {type: String, required: true},
        "collaborators": {type: [String], required: true},
        "lastUpdated": {type: Date, required: true},
    },    
    "documentContent": [{
        "sectionTitle": {type: String, required: true},
        "subSections": [{
            "subSectionTitle": {type: String, required: true},
            "subSectionContent": {type: Object, required: true},
        }],
    }],
})

module.exports = model('Documents', DocumentSchema);

// "owner": "nomote8754@vootin.com"