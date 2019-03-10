const Router = require('koa-router');
const router = new Router();
const Stat = require("../models/stat");



router.get("/",async(ctx)=>{
    
    let startDate = ctx.request.query.startDate || "2019-1"; 
    let params = {
    
       
    };
    
    let statList = await Stat.aggregate([
        {
            $lookup:
              {
                from: "bangumis",
                localField: "bangumiId",
                foreignField: "_id",
                as: "bangumi"
              }
         },
         {
            $match:
              {
                "bangumi.startDate":startDate
              },
         },
         {
              $group : {
                 _id : {
                    bangumiId:"$bangumi._id",
                    title:"$bangumi.title"
                 },
                 like: { $sum:  '$like'},
                 danmaku:{$sum:'$danmaku'},
                 view: { $sum:  '$view'},
                 reply:{$sum:'$reply'},
                 favorite:{$sum:'$favorite'},
                 coin: { $sum:  '$coin'},
                 share:{$sum:'$share'},
                 
              }
         }
    ]);

  


    // for(let index=0;index<statList.length;index++){
    //     statList[index].dateTime = statList[index]._id.year+"-"+statList[index]._id.month+"-"+statList[index]._id.day+" "+statList[index]._id.hour+":00:00";

    // }
    ctx.body = {
        success:true,
        
        datas:statList
    };



    
})






module.exports = router;