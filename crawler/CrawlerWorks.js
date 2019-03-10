const CrawlerSetting = require("../models/crawlerSetting");
const TorrentCrawler = require("./TorrentCrawler");

const Bvideo = require("../models/bvideo");
const BilibiliCrawler = require("../crawler/BilibiliCrawler");
class CrawlerWorks{
    constructor(){
        
    }

    async startWorks(){
        // 获取当前爬虫设置列表
        this.crawlerSetting = await CrawlerSetting.aggregate([
            {
                $lookup:
                  {
                    from: "bangumis",
                    localField: "bangumi",
                    foreignField: "_id",
                    as: "bangumi"
                  }
             },
             {
                $match:
                  {
                    "bangumi.startDate":"2019-1"
                  },
             },
            
        ]);

        
        
        for(let index=0;index<this.crawlerSetting.length;index++){
            let id = this.crawlerSetting[index].bangumi[0]._id;
            console.log(id);
            await new TorrentCrawler({
                bangumiName:this.crawlerSetting[index].bangumiName,
                zimuzu:this.crawlerSetting[index].zimuzu,
                bangumiId:this.crawlerSetting[index].bangumi[0]._id
            }).startCrawler();
            
            
        }

    }

    async startBWorks(){
        // 获取当前爬虫设置列表
      
        this.bvideos = await Bvideo.find({}).exec();
        
        for(let index=0;index<this.bvideos.length;index++){
            await new BilibiliCrawler({
                bangumiId:this.bvideos[index].bangumiId,
                aid:this.bvideos[index].aid
            }).startCrawler();
        }
    }
}

module.exports = CrawlerWorks