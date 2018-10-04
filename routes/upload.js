const Router = require('koa-router');
const router = new Router();
const Resource = require("../models/resource");
const path = require("path");
const md5File = require('md5-file');


const fs = require('fs');




router.post("/",async(ctx,next)=>{
  // ignore non-POSTs
  if ('POST' != ctx.method) return await next();

  const file = ctx.request.files.file;
  let urlPath = "";
  try {
    let md5 = md5File.sync(file.path);
    const reader = fs.createReadStream(file.path);
    urlPath = file.name.split(".").shift()+"-"+md5+"."+file.name.split(".").pop()
    let filePath = path.resolve('./')+"/static/images/"+urlPath;
    const stream = fs.createWriteStream(filePath);
    reader.pipe(stream);
    console.log('uploading %s -> %s', file.name, stream.path);
  } catch (error) {
      ctx.body = error;
  }

  
  let resource = new Resource({
      name:file.name.split(".").shift(),
      type:"image",
      path:"/public/images/"+urlPath,
  })

  let resourceResult = await resource.save();

  ctx.body = {
     resource:resourceResult
  }
})


module.exports = router;