const express=require("express");
const app=express()
const axios=require("axios");
const cors=require("cors");
const pg=require("pg");
PORT=3000
app.use(cors());

const data=require("./data.json");

app.get('/',(req,res)=>{
    res.send("This the Home route");
});



app.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page') 
})

app.get('/allMovies',(req,res)=>{
    res.send(data);
})
app.listen(PORT,()=>{
console.log(`lisiting to the PORT ${PORT}`)
});