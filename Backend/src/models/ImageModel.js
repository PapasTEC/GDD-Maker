const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = model("Image", imageSchema);
