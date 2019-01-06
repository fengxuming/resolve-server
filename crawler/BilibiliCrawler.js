const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
const Stat = require("../models/stat");

/* 
    bangumiId 番剧id
    aid b站视频id


*/
class BilibiliCrawler{
    constructor(options){
        this.bangumiId = options.bangumiId;
        this.aid = options.aid;
        this.url = "https://api.bilibili.com/x/web-interface/archive/stat?aid="+ this.aid;
    }
    async startCrawler(){
        let result = await rp(this.url);
        result = JSON.parse(result);
        result.data.bangumiId = this.bangumiId;
        delete result.data.now_rank;
        delete result.data.his_rank;
        delete result.data.no_reprint;
        delete result.data.copyright;
        let end = await new Stat(result.data).save();
       
    }


    
}





module.exports = BilibiliCrawler