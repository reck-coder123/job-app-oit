const express=require('express');
const path=require('path');
const hbs=require('hbs');
const {Register,Register2} = require('./models/register');
const app=express();
const port=process.env.port|| 8000;
require('./db/db')


const static_path=path.join(__dirname,'../public/')
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path)) ;



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

app.post('/loginA', async (req,res)=>{
    try {
       const emailA=req.body.emailA
       const passwordA=req.body.passwordA
       
       const usermail=await Register.findOne({emailA:emailA});
       if(usermail.passwordA===passwordA){
        res.status(201).render('indexA')
       }
       else{
        res.send('Invalid account details');
       }
    } catch (error) {
        res.status(400).send('Invalid account details')
        
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
            console.log("the token part"+token);
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


app.get('/loginJ',(req,res)=>{
    res.render('loginJ')
})

app.post('/loginJ', async (req,res)=>{
    try {
       const emailJ=req.body.emailJ
       const passwordJ=req.body.passwordJ
       
       const usermail=await Register2.findOne({emailJ:emailJ});
       if(usermail.passwordJ===passwordJ){
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