const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();


let resourceSchema = new Schema({
    name:{type:String,required:true},
    type:String,
    thumb:{type:String},
    path:{type:String,required:true},
    dateCreated:{type:Date,default:Date.now()}
});





resourceSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true} });



module.exports = mongoose.model('Resource', resourceSchema);