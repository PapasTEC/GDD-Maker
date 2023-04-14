const {Schema, model} = require('mongoose');

// Definición del esquema
const imageSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  userId: { type: String, required: true }
});

// Exportación del modelo
module.exports = model('Image', imageSchema);