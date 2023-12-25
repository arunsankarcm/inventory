const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    //URL for product
})

CategorySchema.virtual("url").get(function () {
    return `/catalog/category/${this._id}`;
});

//have to implement virtual property for URL of the product


module.exports = mongoose.model("Category", CategorySchema);