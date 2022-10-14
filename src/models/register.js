const mongoose=require('mongoose');
const jwt =require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const schema=new mongoose.Schema({
    nameA:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    passwordA:{
        type:String,
        required:true,
        unique:true
    },
    ConfirmpasswordA:{
        type:String,
        required:true
    },
    emailA:{
        type:String,
        required:true,
        unique:true
    }
    
})

const schema2=new mongoose.Schema({
    nameJ:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    passwordJ:{
        type:String,
        required:true,
        unique:true
    },
    ConfirmpasswordJ:{
        type:String,
        required:true
    },
    emailJ:{
        type:String,
        required:true,
        unique:true
    }
})
schema.pre("save",async function(next){
    // 
    if(this.isModified("passwordA")){
    this.passwordA= await bcrypt.hash(this.passwordA,10)
    this.ConfirmpasswordA=undefined;
}
    
    next();
})
schema.methods.generateauthToken=async function(){
    try {
        const token =jwt.sign({_id:this._id.toString()},"mynameisayushmishramechanicalengineering");
        console.log(token);
        return token;
    } catch (error) {
        res.send('the error part'+error);
        console.log('the error part'+error);
    }
}

schema2.pre("save",async function(next){
    if(this.isModified("passwordJ")){
    this.passwordJ= await bcrypt.hash(this.passwordJ,10)
    this.ConfirmpasswordJ=undefined;
}
    
    next();
})
schema2.methods.generateauthToken=async function(){
    try {
        const token =jwt.sign({_id:this._id.toString()},"mynameisayushmishramechanicalengineering");
        console.log(token);
        return token;
    } catch (error) {
        res.send('the error part'+error);
        console.log('the error part'+error);
    }
}

const Register=new mongoose.model('Register',schema)
const Register2=new mongoose.model('Register2',schema2)
module.exports={
    Register,Register2
};


