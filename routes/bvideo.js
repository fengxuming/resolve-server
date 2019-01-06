const Router = require('koa-router');
const router = new Router();
const Bvideo = require("../models/Bvideo");


router.all("*",async(ctx,next)=>{
    if(ctx.request.user&&(ctx.request.user.role == "admin")){
        await next();
    }else{
        ctx.body = {
            success:false
        }
    }
});
router.get("/",async(ctx)=>{
    let offset = parseInt(ctx.request.query.offset || 0);
    let maxSize = parseInt(ctx.request.query.maxSize || 20);
    
    let params = {
    //    startDate:startDate
    };
    
    
    
    let totalRecords = await Bvideo.find(params).count();
    let bvideoList = await Bvideo.find(params).limit(maxSize).skip(offset).populate("bangumiId").exec();
    ctx.body = {
        success:true,
        totalRecords:totalRecords,
        datas:bvideoList
    };



    
})


router.get("/:id",async(ctx)=>{
    let id = ctx.params.id;
    let bvideo = await Bvideo.findOne({_id:id}).exec();
    ctx.body = bvideo;
    
})


router.post("/",async(ctx)=>{
    let bvideo = await new Bvideo(ctx.request.body);
    let result = await bvideo.save();
    ctx.body = result;
});

router.put("/:id",async(ctx)=>{
    let bvideoTemp = ctx.request.body;
    let bvideo = await Bvideo.findOne({_id:ctx.params.id});
    for( prop in bvideoTemp){
        bvideo[prop] = bvideoTemp[prop];
    }
    let result = await bvideo.save();
    ctx.body = result;
});

router.delete("/:id",async(ctx)=>{
    
     let result = await Bvideo.deleteOne({_id:ctx.params.id});
     if(!result){
         ctx.body = {
             success:true
         }
     }else{
         ctx.body = result;
     }

})



module.exports = router;