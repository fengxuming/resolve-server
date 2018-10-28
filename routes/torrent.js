const Router = require('koa-router');
const router = new Router();
const Torrent = require("../models/torrent");



router.get("/",async(ctx)=>{
    let params = {};
    if(ctx.request.query.bangumiId){
        params.bangumi = ctx.request.query.bangumiId
    }

    let torrentList = await Torrent.find(params).sort({title:-1}).exec();
    ctx.body = torrentList;
    
})


router.get("/:id",async(ctx)=>{
    let id = ctx.params.id;
    let torrent = await Torrent.findOne({_id:id}).exec();
    ctx.body = torrent;
    
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
    let torrent = await new Torrent(ctx.request.body);
    let result = await torrent.save();
    ctx.body = result;
});

router.put("/:id",async(ctx)=>{
    let torrentTemp= ctx.request.body;
    let torrent = await Torrent.findOne({_id:ctx.params.id});
    for( prop in torrentTemp){
        torrent[prop] = torrentTemp[prop];
    }
    let result = await torrent.save();
    ctx.body = result;
});

router.delete("/:id",async(ctx)=>{
    
     let result = await Torrent.deleteOne({_id:ctx.params.id});
     if(!result){
         ctx.body = {
             success:true
         }
     }else{
         ctx.body = result;
     }

})



module.exports = router;