const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();


let bvideoSchema = new Schema({
    title:{type:String,required:true},
    aid:{type:String,required:true},
    bangumiId:{type:mongoose.Schema.Types.ObjectId,ref:'Bangumi'},
    dateCreated:{type:Date,"default":Date.now},
    dateUpdated:{type:Date,"default":Date.now}
});

bvideoSchema.pre("save",function(next){
    this.dateUpdated = Date.now;
    next();
})



bvideoSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true} });



module.exports = mongoose.model('Bvideo', bvideoSchema);