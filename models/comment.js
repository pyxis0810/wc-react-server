var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    username: String,
    content : String,
    created_at : {
        type : Date,
        default : Date.now()
    }
});

CommentSchema.plugin( autoIncrement.plugin , { model : "comment", field : "id" , startAt : 1 } );
module.exports = mongoose.model('comment' , CommentSchema);
