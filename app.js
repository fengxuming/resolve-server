const Koa = require("koa");
const mount = require('koa-mount');
const static = require('koa-static');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const indexRoute =require("./routes/index");
const userRoute = require("./routes/user");
const bangumiRoute = require("./routes/bangumi");
const torrentRoute = require("./routes/torrent");
const crawlerSettingRoute = require("./routes/crawlerSetting");
const zimuzuRoute = require("./routes/zimuzu");
const loginRoute = require("./routes/login");
const uploadRoute = require("./routes/upload");
const User = require("./models/user");
var jwt = require('jsonwebtoken');
const koaBody = require('koa-body');
const NodeRSA = require("node-rsa");
const fs = require("fs");
const CrawlerWorks = require("./crawler/CrawlerWorks");


const TorrentCrawler = require("./crawler/TorrentCrawler");

const app = new Koa();

// logger

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(koaBody({ multipart: true }));

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

//connect mongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/resolve',{
    useCreateIndex: true,
    useNewUrlParser: true
});

//init admin user
User.initAdmin();

app.use(cors());

app.use(bodyParser());

//mount static resource in route
app.use(mount("/public",static(__dirname + "/static",{
    maxage:"2592000000"
})));


//node-rsa非对称加密
let key = new NodeRSA({b: 512});//生成512位秘钥
let pubkey = key.exportKey('pkcs8-public');//导出公钥
let prikey = key.exportKey('pkcs8-private');//导出私钥
fs.writeFileSync("./pubkey.pem",pubkey);
fs.writeFileSync("./prikey.pem",prikey);
//前端获取公钥的接口
app.use(mount("/getPubkey",async(ctx)=>{
    try {
        let pubkey = fs.readFileSync("./pubkey.pem","utf8");
        ctx.body = {
            success:true,
            data:{
                pubkey:pubkey
            }
        }
    } catch (error) {
        ctx.body = {
            success:false,
            errorMsg:error
        }
    }
    
}));

//登录
app.use(mount("/login",loginRoute.routes()));

app.use(async(ctx,next)=>{
    let secretOrPrivateKey="reject";
    let token = ctx.request.body.token || ctx.request.query.token || ctx.request.headers["token"] || ctx.request.headers["x-access-token"]; // 从body或query或者header中获取token    jwt.verify(token, secretOrPrivateKey, function (err, decode) {
    if(token){
        let decode = jwt.verify(token, secretOrPrivateKey);
        if(!decode){
            ctx.body = {
                success:false
            }
        }else{
            let user = await User.findOne({username:decode.username});
            ctx.request.user = user;
            await next();
        }
        
    } else {
       if(ctx.request.originalUrl.indexOf("bangumis")>-1||ctx.request.originalUrl.indexOf("torrents")>-1){
            await next();
       }else{
            ctx.body = {
                success:false
            }
       }
       


    }
})

app.use(mount("/",indexRoute.routes()));
app.use(mount("/users",userRoute.routes()));
app.use(mount("/bangumis",bangumiRoute.routes()));
app.use(mount("/uploads",uploadRoute.routes()));
app.use(mount("/torrents",torrentRoute.routes()));
app.use(mount("/crawlerSettings",crawlerSettingRoute.routes()));
app.use(mount("/zimuzus",zimuzuRoute.routes()));


let craler = new CrawlerWorks();

craler.startWorks();
setInterval(()=>{
    craler.startWorks();
},21600000)




app.listen("3000");