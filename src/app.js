const express=require('express');
const path=require('path');
const hbs=require('hbs');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieparser=require('cookie-parser');
const {Register,Register2} = require('./models/register');
const app=express();
const port=process.env.port|| 5000;
require('./db/db')
const auth=require('./middleware/auth');


const static_path=path.join(__dirname,'../public/')
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path)) ;
app.use(cookieparser());


app.set('view engine','hbs');
const viewpath=path.join(__dirname,'../template/views');
const partialpath=path.join(__dirname,'../template/partial' );
app.set('views',viewpath)
hbs.registerPartials(partialpath);


app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/loginA',(req,res)=>{
    res.render('loginA');
})

app.get('/indexA',auth,(req,res)=>{
    res.render('indexA');
})

app.post('/loginA', async (req,res)=>{
    try {
       const emailA=req.body.emailA
       const passwordA=req.body.passwordA
       
       const usermail=await Register.findOne({emailA:emailA});
       const isMatch= await bcrypt.compare(passwordA,usermail.passwordA);
       const token= await usermail.generateauthToken();
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+500000),
            httpOnly:true
        })
        
       if(isMatch){
        res.status(201).render('indexA')
       }
       else{
        res.send('Invalid account details');
       }
    } catch (error) {
        res.status(400).send(error)
        
    }
})
app.get('/registerA',(req,res)=>{
    res.render('registerA')
})

app.post('/registerA', async (req,res)=>{ 
    try {
        const passwordA=req.body.passwordA;
        const cpasswordA=req.body.ConfirmpasswordA;
       if(passwordA===cpasswordA){
            const register=new Register({
                nameA:req.body.nameA,
                username:req.body.username,
                passwordA:req.body.passwordA,
                emailA:req.body.emailA,
                ConfirmpasswordA:req.body.ConfirmpasswordA
            })
            console.log(
                "the success part"+register
            );
            const token= await register.generateauthToken();
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+500000),
                httpOnly:true
            })

            const registered=await register.save();
            res.status(201).render('loginA');
       }
       else{
        res.send("Passwords are not matching")
       }
    } catch (error) {
        res.status(404).send(error);
    }
})

app.get('/add_jobs',auth,(req,res)=>{
    res.render('add_jobs');
})

app.get('/logout',auth, async(req,res)=>{
    try {

        req.user.tokens=req.user.tokens.filter((current)=>{
            return current.token!==req.token;
        })

        res.clearCookie("jwt");
        console.log("logout successfully");

        await req.user.save()
        res.render('loginA');
    } catch (error) {
        res.status(401).send(error)
    }
})

app.get('/loginJ',(req,res)=>{
    res.render('loginJ')
})

app.get('/indexJ',(req,res)=>{
    res.render('indexJ');
})

app.post('/loginJ', async (req,res)=>{
    try {
       const emailJ=req.body.emailJ
       const passwordJ=req.body.passwordJ
       
       const usermailJ=await Register2.findOne({emailJ:emailJ});
       const isMatch= await bcrypt.compare(passwordJ,usermailJ.passwordJ);
       const tokenJ= await usermailJ.generateauthTokenJ();
       res.cookie("jwt",tokenJ,{
        expires:new Date(Date.now()+500000),
        httpOnly:true
    })
        
       if(isMatch){
        res.status(201).render('indexJ')
       }
       else{
        res.send('Invalid account details');
       }
    } catch (error) {
        res.status(400).send('Invalid account details')
        
    }
})

app.get('/registerJ',(req,res)=>{
    res.render('registerJ')
})

app.post('/registerJ', async (req,res)=>{
    try {
        const passwordJ=req.body.passwordJ;
        const cpasswordJ=req.body.ConfirmpasswordJ;
       if(passwordJ===cpasswordJ){
            const register2=new Register2({
                nameJ:req.body.nameJ,
                username:req.body.username,
                passwordJ:req.body.passwordJ,
                emailJ:req.body.emailJ,
                ConfirmpasswordJ:req.body.ConfirmpasswordJ
            })
            console.log(
                "the success part"+register2
            );
            const tokenJ= await register2.generateauthTokenJ();
            

            res.cookie("jwt",tokenJ,{
                 expires:new Date(Date.now()+500000),
                httpOnly:true
            });

            const registered2=await register2.save();
            res.status(201).render('loginJ');
       }
       else{
        res.send('Invalid Format');
       }
    } catch (error) {
        res.status(404).send(error);
    }
})



app.listen(port,()=>{
    console.log(`server is listening on http://localhost:${port}`)
    ;
})
