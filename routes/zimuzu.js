const Router = require('koa-router');
const router = new Router();
const Zimuzu = require("../models/zimuzu");



router.get("/",async(ctx)=>{
    let params = {};
    
    let zimuzuList = await Zimuzu.find(params).exec();
    ctx.body = zimuzuList;
    
})


router.get("/:id",async(ctx)=>{
    let id = ctx.params.id;
    let zimuzu = await Zimuzu.findOne({_id:id}).exec();
    ctx.body = zimuzu;
    
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
    let zimuzu = await new Zimuzu(ctx.request.body);
    let result = await zimuzu.save();
    ctx.body = result;
});

router.put("/:id",async(ctx)=>{
    let zimuzuTemp = ctx.request.body;
    let zimuzu = await Zimuzu.findOne({_id:ctx.params.id});
    for( prop in zimuzuTemp){
        zimuzu[prop] = zimuzuTemp[prop];
    }
    let result = await zimuzu.save();
    ctx.body = result;
});

router.delete("/:id",async(ctx)=>{
    
     let result = await Zimuzu.deleteOne({_id:ctx.params.id});
     if(!result){
         ctx.body = {
             success:true
         }
     }else{
         ctx.body = result;
     }

})



module.exports = router;