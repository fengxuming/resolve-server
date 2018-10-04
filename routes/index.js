const Router = require('koa-router');
const router = new Router();


router.get("/",async(ctx)=>{
    ctx.body= {
        message:"index route"
    };
    
})

router.get("/test",async(ctx)=>{
    ctx.body = "come here"
})

module.exports = router;