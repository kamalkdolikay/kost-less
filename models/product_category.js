var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductCatSchema = new Schema({
    category: { type: String, unique: true },
    order: { type: Schema.Types.ObjectId, ref: 'Product' }
});

mongoose.model('ProductCat', ProductCatSchema, 'ProductCat');