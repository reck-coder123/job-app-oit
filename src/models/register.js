const mongoose=require('mongoose');
const jwt =require('jsonwebtoken');
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

const Register=new mongoose.model('Register',schema)
const Register2=new mongoose.model('Register2',schema2)
module.exports={
    Register,Register2
};


