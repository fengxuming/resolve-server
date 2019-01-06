const Router = require('koa-router');
const router = new Router();
const Stat = require("../models/stat");



router.get("/",async(ctx)=>{
    let offset = parseInt(ctx.request.query.offset || 0);
    let maxSize = parseInt(ctx.request.query.maxSize || 20);
    let startDate = ctx.request.query.startDate || "2018-10"; 
    let aid = ctx.request.query.aid; 
    let params = {
    //    startDate:startDate
        aid:aid
    };
    
    
    
  
    let statList = await Stat.aggregate([
        {
            $match:
              {
                "aid":aid
              },
        },
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
              $group : {
                 _id : { month: { $month: "$dateCreated" }, day: { $dayOfMonth: "$dateCreated" }, year: { $year: "$dateCreated" },hour: { $hour: "$dateCreated" } },
                 like: { $max:  '$like'},
                 danmaku:{$max:'$danmaku'},
                 view: { $max:  '$view'},
                 reply:{$max:'$reply'},
                 favorite:{$max:'$favorite'},
                 coin: { $max:  '$coin'},
                 share:{$max:'$share'}
              }
         },{
             $sort:{_id:1}
         }
    ]);

  


    for(let index=0;index<statList.length;index++){
        statList[index].dateTime = statList[index]._id.year+"-"+statList[index]._id.month+"-"+statList[index]._id.day+" "+statList[index]._id.hour+":00:00";

    }
    ctx.body = {
        success:true,
        
        datas:statList
    };



    
})






module.exports = router;