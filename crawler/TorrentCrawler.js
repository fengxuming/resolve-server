
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
const Torrent = require("../models/torrent");
//动画花园种子爬虫
/**
 * options.bangumiName //搜索关键字
 * options.zimuzu  //字幕组编码
 * options.intervalTime //爬取时间间隔
 * options.bangumiId //番剧
 */
class TorrentCrawler{
    constructor(options){
        this.bangumiName = options.bangumiName;
        this.bangumiId = options.bangumiId;
        this.zimuzu = options.zimuzu;
        this.intervalTime = options.intervalTime;
        this.orderParams =  "&order=date-desc";
        this.teamParams = "&team_id="+options.zimuzu;
        this.keywordParams = "?keyword="+encodeURI(options.bangumiName);
        this.url = "http://dmhy.org/topics/list";
        this.saveFolder = "./static/torrents/";
        this.torrentPath = "/public/torrents/";

        this.pageLinkList = [];
        this.torrentCount =  0;
    }

    async startCrawler(){
        this.torrentCount = await Torrent.find({bangumi:this.bangumiId}).countDocuments().exec();
        
       await this.getPageLinkList();
        
    }

    async getPageLinkList(){
        let listPage = await rp(this.url+this.keywordParams+this.teamParams+this.orderParams);
        
        const $listPage = cheerio.load(listPage);

        let torrentList = $listPage("#topic_list tbody tr");
       
        
        let pageLinkList = this.pageLinkList;
        
        let torrentCount = this.torrentCount;
        if(torrentList.length > torrentCount){
            
            torrentList.each(function(i,torrentItem){
                
                if((torrentList.length-i)>=torrentCount){
                    
                    let pageLink = $listPage(this).find(".title span").next().attr("href");
                    
                    pageLinkList.push(pageLink);
                }

            })
            
            for(let index=0;index<this.pageLinkList.length;index++){
                this.pageHtmlCrawler(this.pageLinkList[index]);
            }
        }
        
        

    }

    async pageHtmlCrawler(pageLink){
        let detailPage = await rp("http://dmhy.org"+pageLink);
        const $detailPage = cheerio.load(detailPage);


        let fileList = $detailPage(".file_list ul li");
      
        let fileListArray  = [];
        fileList.each(function(i,fileItem){
            let fileName = $detailPage(this).children()[0].next.data.replace(/[\t]/g,"");
            let fileSize = $detailPage(this).find("span").text();
            fileListArray.push({
                fileName:fileName,
                fileSize:fileSize
            })
            
        })
        
        let title = $detailPage(".topic-title h3").text();
        let torrentLink = $detailPage("#tabs-1 p a").attr("href");
        let name = torrentLink.split("/")[torrentLink.split("/").length - 1];
        let writeStream = fs.writeFileSync(this.saveFolder +name);
        fs.cre
        rp("http:"+torrentLink).pipe(writeStream);

        writeStream.on("close",async ()=>{
            
            let result = await new Torrent({
                title:title,
                path:this.torrentPath + name,
                fileList:fileListArray,
                bangumi:this.bangumiId
            }).save();
            
        });
    }

    
}





module.exports = TorrentCrawler