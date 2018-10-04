const Router = require('koa-router');
const router = new Router();
const Bangumi = require("../models/bangumi");



router.get("/",async(ctx)=>{
    let bangumiList = await Bangumi.find({});
    ctx.body = bangumiList;
    
})
router.post("/",async(ctx)=>{
    let bangumi = await new Bangumi(ctx.request.body);
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