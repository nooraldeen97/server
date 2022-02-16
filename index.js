const express=require("express");
const app=express()
const axios=require("axios");
const cors=require("cors");
require('dotenv').config()
const pg=require("pg");
PORT=process.env.PORT;
app.use(cors("*"));

app.use(express.json()); // this is important for using req.body

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

const data=require("./data.json");
const req = require("express/lib/request");


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
try{
    let theData=await axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US");    
    let newData=theData.data.results.map(element=>{
         return new Trending(element);
     })
 
     res.send(newData);

}catch(error){
    console.log(error)
}
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


//http://localhost:3000/addMovie
app.post("/addMovie",addingMovies)

async function addingMovies(req,res){

     const {title ,release_date, poster_path ,overview ,comment}=req.body;

     try{
         let sql = 'INSERT INTO movies (title, release_date, poster_path, overview, comment) VALUES ($1, $2, $3, $4, $5)';
         let safeValues = [title, release_date, poster_path, overview, comment];
         let result = await client.query(sql, safeValues);
     
         res.send(result);

     }catch(error){
        console.log(error)
     }
}


//http://localhost:3000/getMovies
app.get("/getMovies",getAllMovies)


async function getAllMovies(req,res){
    let sql = 'SELECT * FROM movies';
    let result = await client.query(sql);
    console.log("getting data")
    res.send(result.rows);
}

//http://localhost:3000/getMovies/:id
app.get("/getMovies/:id",getSpecificMovie)

async function getSpecificMovie(req,res){
    let id=req.params.id;
    console.log(req.params)
    let sql = `SELECT * FROM movies WHERE id=${id}`;
    let result = await client.query(sql);
    console.log("getting data")
    res.send(result.rows);
}

//http://localhost:3000/update/:id
app.put("/update/:id",updateMovieHandler)

async function updateMovieHandler(req,res){
    let id=req.params.id;
    let newComment=req.body.comment;
    let sql = `UPDATE movies SET comment = '${newComment}'WHERE id=${id}`;
    let result = await client.query(sql);
    console.log("getting data")
    res.send(result.rows);
}


//http://localhost:3000/delete/:id
app.delete("/delete/:id",deleteMovieHandler)

async function deleteMovieHandler(req,res){
    let id=req.params.id;
    let sql=`DELETE FROM movies WHERE id=${id}`;
    let result=await client.query(sql);

    res.send("the record deleted successfully")
}



//handle the 404 errors 
app.use((req,res)=>{
    res.status(404).send({
        error:"something went wrong 404 Status !!!"
    });
})

//handle the 500 errors 
app.use((err,req,res,next)=>{
    res.status(500).send({
        error:"something went wrong 500 Status !!!"
    });
    
})


client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    })

