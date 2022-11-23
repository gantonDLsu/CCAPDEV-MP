const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('mysql');
const { render } = require('ejs');
/*
const db = mysql.createConnection({
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'test',
        database: 'enteract',
    }
})
*/


const app = express();
let name;
let user;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));



app.get("/signup.ejs", function (req, res){
    res.render("signup");
});

app.post("/signup.ejs", function (req, res){
    //let name = res.body.name;
    //let user = res.body.username;
    name = res.body.name;
    user = res.body.username;
    
    res.render("blogpage", { Name: name, userName: name});
    res.redirect("/blogpage")
});

app.get("/blogpage.html", function (req, res){
    console.log(name);
    console.log(user);
    res.render("blogpage", { Name: name, userName: name});
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});