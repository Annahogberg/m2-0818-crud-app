const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const opSchema = new Schema({
  texto: String,
  book: {type: Schema.Types.ObjectId, ref:'Book'}
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Opinion = mongoose.model("Opinion", opSchema);

module.exports = Opinion;