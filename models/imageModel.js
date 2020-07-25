var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var imageSchema = new Schema ({
    image: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    }
});
var Image = mongoose.model('Image',imageSchema);
module.exports = Image;