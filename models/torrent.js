const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();


let torrentSchema = new Schema({
    title:{type:String,required:true},
    path:{type:String,required:true},
    fileList:[{
        fileName:{type:String},
        fileSize:{type:String}
    }],
    bangumi:{type:mongoose.Schema.Types.ObjectId,ref:'Bangumi',index:true},
    dateCreated:{type:Date,"default":Date.now},
    dateUpdated:{type:Date,"default":Date.now}
});

torrentSchema.pre("save",function(next){
    this.dateUpdated = Date.now;
    next();
})



torrentSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true} });



module.exports = mongoose.model('Torrent', torrentSchema);