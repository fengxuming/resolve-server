const CrawlerSetting = require("../models/crawlerSetting");
const TorrentCrawler = require("./TorrentCrawler");
class CrawlerWorks{
    constructor(){
        
    }

    async startWorks(){
        this.crawlerSetting = await CrawlerSetting.find({}).exec();

        for(let index=0;index<this.crawlerSetting.length;index++){
            new TorrentCrawler({
                bangumiName:this.crawlerSetting[index].bangumiName,
                zimuzu:this.crawlerSetting[index].zimuzu,
                bangumiId:this.crawlerSetting[index].bangumi
            }).startCrawler();
        }

    }
}

module.exports = CrawlerWorks