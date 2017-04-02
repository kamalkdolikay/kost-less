var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    product_id: { type: Number, unique: true },
    product_name: String,
    product_price: Number,
    product_category: String,
    image: String,
    date: String
});

mongoose.model('Product', ProductSchema, 'Product');