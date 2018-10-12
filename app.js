const Koa = require("koa");
const mount = require('koa-mount');
const static = require('koa-static');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const indexRoute =require("./routes/index");
const userRoute = require("./routes/user");
const bangumiRoute = require("./routes/bangumi");
const loginRoute = require("./routes/login");
const uploadRoute = require("./routes/upload");
const User = require("./models/user");
var jwt = require('jsonwebtoken');
const koaBody = require('koa-body');

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
mongoose.connect('mongodb://localhost/resolve');

//init admin user
User.initAdmin();

app.use(cors());

app.use(bodyParser());

//mount static resource in route
app.use(mount("/public",static(__dirname + "/static")));

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
       if(ctx.request.originalUrl.indexOf("bangumis")>-1){
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



app.listen("3000");