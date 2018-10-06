const Router = require('koa-router');
const router = new Router();
const User = require("../models/user");

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
    let userList = await User.find({});
    ctx.body = userList;
    
})
router.post("/",async(ctx)=>{
    let user = await new User(ctx.request.body);
    let result = await user.save();
    ctx.body = result;
});

router.delete("/:id",async(ctx)=>{
    console.log(ctx.params)
     let result = await User.deleteOne({_id:ctx.params.id});
     if(!result){
         ctx.body = {
             success:true
         }
     }else{
         ctx.body = result;
     }

})

router.get("/test",async(ctx)=>{
    ctx.body = "come here"
})

module.exports = router;