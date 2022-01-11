const express=require("express");
const app=express()
const axios=require("axios");
const cors=require("cors");
const pg=require("pg");
PORT=3000
app.use(cors());

const data=require("./data.json");


function Movies(data){
    this.title=data.title;
    this.poster_path=data.poster_path;
    this.overview=data.overview;
}


//localhost:3000/
app.get('/',(req,res)=>{
    let newMovie=new Movies(data);
    res.send(newMovie);
});


//localhost:3000/favorite
app.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page') 
})


// app.get('*',(req,res)=>{
//     let errObj = {
//         status: 500,
//         responseText: "Sorry, something went wrong"
//     }
//     res.status(500).send(errObj);
// })



app.use((req,res)=>{
    res.status(404).send({
        error:"somthing went wrong 404 Status !!!"
    });
})

app.use((err,req,res,next)=>{
    res.status(500).send({
        error:"somthing went wrong 500 Status !!!"
    });
    
})

app.listen(PORT,()=>{
console.log(`lisiting to the PORT ${PORT}`)
});