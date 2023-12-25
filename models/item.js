const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    stock: { type: Number, required: true },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }]
});

// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);
