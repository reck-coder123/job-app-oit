require('dotenv').config();
var id,idJ
const express=require('express');
const path=require('path');
const hbs=require('hbs');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieparser=require('cookie-parser');
const {Register,Register2,Jobs1,Apply1} = require('./models/register');
const app=express();
const port=process.env.port|| 5000;
const db=require('./db/db')
const {auth,authJ}=require('./middleware/auth');



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
       id =usermail._id.toString();
       
        res.status(201).render('indexA')
       }
       else{
        res.send('Invalid account details',);
       }
    } catch (error) {
        res.status(400).send(error)
        
    }
    
})

app.get('/indexA',auth,async(req,res)=>{
    const user=await Register.findById(id);
    res.render('indexA',{user:user});
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
            res.status(201).render('registerA',{message:"Registration successfull"});
       }
       else{
        res.send("Passwords are not matching")
       }
    } catch (error) {
        res.status(404).send(error);
    }
    console.log(req.body);
})

app.get('/profile',async(req,res)=>{
    const user=await Register.findById(id);
    res.render('profile',{user:user});
})


app.get('/add_jobs',auth,(req,res)=>{
    res.render('add_jobs');
})

app.post('/add_jobs',async (req,res)=>{
    try {

        const add=new Jobs1({
            job:req.body.job,
            description:req.body.description,
            vacancy:req.body.vacancy
        })
        console.log(req.body);
        const added=await add.save();
            res.status(201).render('add_jobs',{message:"Job profile added successfully!!"});

    } catch (error) {
       res.status(404).send(error);
    }
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

app.get('/indexJ',authJ,(req,res)=>{
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
    idJ =usermailJ._id.toString(); 
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
            res.status(201).render('registerJ',{message:"Resgistration successfull!!"});
       }
       else{
        res.render('update',{message:'passwords are not matching'})
       }
    } catch (error) {
        res.status(404).send(error);
    }
})

app.get('/profileJ',authJ,async(req,res)=>{
    const userJ= await Register2.findById(idJ);
res.render('profileJ',{userJ:userJ});
})


app.get('/view_jobs',authJ,async(req,res)=>{
    Jobs1.find({}, function(err, posts){
        if(err){
            console.log(err);
        }
        else {
            res.render('view_jobs',{posts:posts}) 
        }
    });
    
   
    
});

app.post('/view_jobs',authJ, async(req,res)=>{

    try {
        const apply=new Apply1({
            Name:req.body.Name,
            jprofile:req.body.jprofile,
            phoneno:req.body.phoneno,
            emailId:req.body.emailId
        })
        const added1= await apply.save()
        res.render('view_jobs',{message:"Applied Successfully!!"})
    } catch (error) {
        res.status(401).send(error)
    }
    
})

app.get('/show_applicants',auth, async(req,res)=>{
    Apply1.find({}, function(err, posts){
        if(err){
            console.log(err);
        }
        else {
            res.render('show_applicants',{posts:posts}) 
        }
    });
})
    
app.get('/logoutJ',authJ, async(req,res)=>{
    try {

        req.userJ.tokensJ=req.userJ.tokensJ.filter((current)=>{
            return current.tokenJ!==req.tokenJ;
        })

        res.clearCookie("jwt");
        console.log("logout successfully");

        await req.userJ.save()
        res.render('loginJ',{message:"Logout Successfull"});
    } catch (error) {
        res.status(401).send(error)
    }
})

app.listen(port,()=>{
    console.log(`server is listening on http://localhost:${port}`)
    ;
})
