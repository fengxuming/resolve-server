const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();


let bangumiSchema = new Schema({
    title:{type:String,required:true},
    info:{type:String},
    cover:{type:mongoose.Schema.Types.ObjectId,ref:'Resource'},
    weekDay:{type:Number,enum:[0,1,2,3,4,5,6],index:true},
    cast:[{type:String}],
    staff:[{type:String}],
    dateCreated:{type:Date,"default":Date.now},
    dateUpdated:{type:Date,"default":Date.now}
});

bangumiSchema.pre("save",function(next){
    this.dateUpdated = Date.now;
    next();
})



bangumiSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true} });



module.exports = mongoose.model('Bangumi', bangumiSchema);