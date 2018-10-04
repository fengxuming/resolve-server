const Router = require('koa-router');
const router = new Router();
const User = require("../models/user");
var jwt = require('jsonwebtoken');


router.post("/",async(ctx)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    let user = await User.findOne({username:username});
    
    if(!user){
        ctx.body = {
            success:false
        };
    }
    let isMatch = user.comparePassword(password);
    
    if(!isMatch){
       
        ctx.body = {
            success:false
        };
    }else{
        let content ={msg:"resolve",username:username}; // 要生成token的主题信息
        let secretOrPrivateKey="reject";
        let token = await jwt.sign(content, secretOrPrivateKey, {
            expiresIn: 60*60*24  // 24小时过期
        });
        
        ctx.body = {
            success: true,
            access_token: token,
            user:user
        };
    }

    
});


module.exports = router;