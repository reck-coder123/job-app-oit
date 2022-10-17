require('dotenv').config();
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
    },
    tokens:[{
        token:{
        type:String,
        required:true
        }
    }]
    
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
    },
    tokensJ:[{
        tokenJ:{
        type:String,
        required:true
        }
    }]
})
schema.pre("save",async function(next){
    // 
    if(this.isModified("passwordA")){
    this.passwordA= await bcrypt.hash(this.passwordA,10)
    this.ConfirmpasswordA=await bcrypt.hash(this.passwordA,10);
}
    
    next();
})
schema.methods.generateauthToken=async function(){
    try {
        const token =jwt.sign({_id:this._id.toString()},"mynameisayushmishramechanicalengineeringno");
        console.log(token);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send('the error part'+error);
        console.log('the error part'+error);
    }
}

schema2.pre("save",async function(next){
    if(this.isModified("passwordJ")){
    this.passwordJ= await bcrypt.hash(this.passwordJ,10)
    this.ConfirmpasswordJ=await bcrypt.hash(this.passwordJ,10);
}
    
    next();
})
schema2.methods.generateauthTokenJ=async function(){
    try {
        const tokenJ =jwt.sign({_id:this._id.toString()},"mynameisayushmishramechanicalengineeringyes");
        console.log(tokenJ);
        this.tokensJ=this.tokensJ.concat({tokenJ:tokenJ});
        await this.save();
        return tokenJ;
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


