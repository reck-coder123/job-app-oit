const jwt=require('jsonwebtoken');
const {Register,Register2}=require('../models/register');

const auth= async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verifyuser=jwt.verify(token,"mynameisayushmishramechanicalengineeringno")
        console.log(verifyuser);

        const user= await Register.findOne({_id:verifyuser._id});
        console.log(user);

        req.token=token;
        req.user=user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }

}

const authJ=async(req,res,next)=>{
    try {
        const tokenJ=req.cookies.jwt;
        const verifyuserJ=jwt.verify(tokenJ,"mynameisayushmishramechanicalengineeringyes")
        console.log(verifyuserJ);

        const userJ=await Register2.findOne({_id:verifyuserJ._id});
        console.log(userJ);
    
        req.tokenJ=tokenJ;
        req.userJ=userJ;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports={auth,authJ};
