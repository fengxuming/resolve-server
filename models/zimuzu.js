const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();


let zimuzuSchema = new Schema({
    name:{type:String,required:true},
    code:{type:Number,required:true},
    dateCreated:{type:Date,"default":Date.now},
    dateUpdated:{type:Date,"default":Date.now}
});

zimuzuSchema.pre("save",function(next){
    this.dateUpdated = Date.now;
    next();
})



zimuzuSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true} });



module.exports = mongoose.model('Zimuzu', zimuzuSchema);