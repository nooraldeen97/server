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

function Trending(newMov){
    this.id=newMov.id;
    this.title=newMov.title;
    this.release_date=newMov.release_date;
    this.poster_path=newMov.poster_path;
    this.overview=newMov.overview
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



//localhost:3000/trending
app.get('/trending',getFromApi)

async function getFromApi(req,res){
   let theData=await axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US");    
   let newData=theData.data.results.map(element=>{
        return new Trending(element);
    })

    res.send(newData);
}

//http://localhost:3001/search?name=Harry
app.get('/search',searchHandler)

async function searchHandler(req,res){
    let searchQuery=req.query.name;
    console.log(req);
    let filteredData=await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=${searchQuery}&page=2`);
    let nObj=filteredData.data.results.map(element=>{
        return new Trending(element);
    })

    res.send(nObj);
}

//handle the 404 errors 
app.use((req,res)=>{
    res.status(404).send({
        error:"somthing went wrong 404 Status !!!"
    });
})

//handle the 500 errors 
app.use((err,req,res,next)=>{
    res.status(500).send({
        error:"somthing went wrong 500 Status !!!"
    });
    
})

app.listen(PORT,()=>{
console.log(`lisiting to the PORT ${PORT}`)
});