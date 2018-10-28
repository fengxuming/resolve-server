const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();


let crawlerSettingSchema = new Schema({
    bangumiName:{type:String},
    zimuzu:{type:Number},
    intervalTime:{type:String},//抓取间隔时间
    bangumi:{type:mongoose.Schema.Types.ObjectId,ref:'Bangumi'},
    dateCreated:{type:Date,"default":Date.now},
    dateUpdated:{type:Date,"default":Date.now}
});

crawlerSettingSchema.pre("save",function(next){
    this.dateUpdated = Date.now;
    next();
})



crawlerSettingSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true} });



module.exports = mongoose.model('CrawlerSetting', crawlerSettingSchema);