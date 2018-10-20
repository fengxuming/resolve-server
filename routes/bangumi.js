const Router = require('koa-router');
const router = new Router();
const Bangumi = require("../models/bangumi");



router.get("/",async(ctx)=>{
    
    let weekday = ctx.request.query.weekday;
    
    let bangumiList = await Bangumi.find({weekDay:weekday}).populate("cover").exec();
    ctx.body = bangumiList;
    
})


router.get("/:id",async(ctx)=>{
    let id = ctx.params.id;
    let bangumi = await Bangumi.findOne({_id:id}).populate("cover").exec();
    ctx.body = bangumi;
    
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
    let bangumi = await new Bangumi(ctx.request.body);
    let result = await bangumi.save();
    ctx.body = result;
});

router.put("/:id",async(ctx)=>{
    let bangumiTemp = ctx.request.body;
    let bangumi = await Bangumi.findOne({_id:ctx.params.id});
    for( prop in bangumiTemp){
        bangumi[prop] = bangumiTemp[prop];
    }
    let result = await bangumi.save();
    ctx.body = result;
});

router.delete("/:id",async(ctx)=>{
    
     let result = await Bangumi.deleteOne({_id:ctx.params.id});
     if(!result){
         ctx.body = {
             success:true
         }
     }else{
         ctx.body = result;
     }

})



module.exports = router;