const CrawlerSetting = require("../models/crawlerSetting");
const TorrentCrawler = require("./TorrentCrawler");

const Bvideo = require("../models/Bvideo");
const BilibiliCrawler = require("../crawler/BilibiliCrawler");
class CrawlerWorks{
    constructor(){
        
    }

    async startWorks(){
        // 获取当前爬虫设置列表
        this.crawlerSetting = await CrawlerSetting.find({}).exec();

        for(let index=0;index<this.crawlerSetting.length;index++){
            await new TorrentCrawler({
                bangumiName:this.crawlerSetting[index].bangumiName,
                zimuzu:this.crawlerSetting[index].zimuzu,
                bangumiId:this.crawlerSetting[index].bangumi
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