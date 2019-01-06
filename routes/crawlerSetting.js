const Router = require('koa-router');
const router = new Router();
const CrawlerSetting = require("../models/crawlerSetting");



router.get("/",async(ctx)=>{
    let offset = parseInt(ctx.request.query.offset || 0);
    let maxSize = parseInt(ctx.request.query.maxSize || 20);
    let params = {};

    let totalRecords = await CrawlerSetting.find({}).count();
    let crawlerSettingList = await CrawlerSetting.find(params).limit(maxSize).skip(offset).exec();
    ctx.body = {
        success:true,
        totalRecords :totalRecords,
        datas:crawlerSettingList
    };
    
})


router.get("/:id",async(ctx)=>{
    let id = ctx.params.id;
    let crawlerSetting = await CrawlerSetting.findOne({_id:id}).exec();
    ctx.body = crawlerSetting;
    
})

router.all("*",async(ctx,next)=>{
    if(ctx.request.user&&(ctx.request.user.role == "admin")){
        await next();
    }else{
        ctx.body = {
            success:false
        }
    }
});
router.post("/",async(ctx)=>{
    let crawlerSetting = await new CrawlerSetting(ctx.request.body);
    let result = await crawlerSetting.save();
    ctx.body = result;
});

router.put("/:id",async(ctx)=>{
    let crawlerSettingTemp= ctx.request.body;
    let crawlerSetting = await CrawlerSetting.findOne({_id:ctx.params.id});
    for( prop in crawlerSettingTemp){
        crawlerSetting[prop] = crawlerSettingTemp[prop];
    }
    let result = await crawlerSetting.save();
    ctx.body = result;
});

router.delete("/:id",async(ctx)=>{
    
     let result = await CrawlerSetting.deleteOne({_id:ctx.params.id});
     if(!result){
         ctx.body = {
             success:true
         }
     }else{
         ctx.body = result;
     }

})



module.exports = router;