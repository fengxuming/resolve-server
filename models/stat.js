const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();


let statSchema = new Schema({
    bangumiId:{type:mongoose.Schema.Types.ObjectId,ref:'Bangumi'},
    aid:{type:String,required:true},//b站视频id
    view:{type:Number,required:true},//播放数
    danmaku:{type:Number,required:true},//弹幕数
    reply:{type:Number,required:true},//评论数
    favorite:{type:Number,require:true},//收藏数
    coin:{type:Number,required:true},//硬币数
    share:{type:Number,required:true},//分享数
    like:{type:Number,required:true},//点赞数
    dateCreated:{type:Date,"default":Date.now},
    dateUpdated:{type:Date,"default":Date.now}
});

statSchema.pre("save",function(next){
    this.dateUpdated = Date.now;
    next();
})



statSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true} });



module.exports = mongoose.model('Stat', statSchema);