const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseHidden  = require("mongoose-hidden")();
let bcrypt = require('bcrypt-nodejs');

let userSchema = new Schema({
    username:{type:String,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:"user",required:true,enum:["admin","user"]},
    dateCreated:{type:Date,"default":Date.now},
    dateUpdated:{type:Date,"default":Date.now}
});

userSchema.pre("save",function(next){
    let hash = bcrypt.hashSync(this.password);
    this.password = hash;
    
    this.dateUpdated = Date.now;
    next();
});

userSchema.methods = {
    comparePassword: function(_password){
        let hash = this.password;
        let isMatch = bcrypt.compareSync(_password, hash);
        
        return isMatch;
    }
};

userSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true,password:true} });

userSchema.statics.initAdmin =  function() {
    let _this = this;
    _this.findOne({username:"admin"},  function(err, user){
        if(!user){
            let admin = {"username":"admin", "password":"12348765","role":"admin"};
            let user = new _this(admin);
            user.save(function(err,user){
                if(err){
                    throw err;
                }
                console.log(user);
            });
        }
    });
    console.log("init admin ...");
};

module.exports = mongoose.model('User', userSchema);