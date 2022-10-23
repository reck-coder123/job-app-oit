const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/Jobs",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log('connection successfull')
}).catch((e)=>{
    console.log(e);
})

