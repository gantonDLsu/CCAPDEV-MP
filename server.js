const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
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

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

let fullname;
let username;

app.get("/", function (req, res){
    res.render("index");
});

app.get("/signup.ejs", function (req, res){
    res.render("signup");
});

app.post("/signup.ejs", function (req, res){
    let data = {
        name: req.body.name, 
        email: req.body.email, 
        user: req.body.username,
        password: req.body.password
    };
    fullname = data.name;
    username = data.user;
    res.render("blogpage", { Name: data.name, userName: data.user});
    res.redirect("/blogpage.ejs");
});

app.get("/aboutus.ejs", function (req, res){
    res.render("aboutus");
});
app.get("/blogpage.ejs", function (req, res){
    res.render("blogpage", { Name: fullname, userName: username});
});


app.listen(3000, () => console.log('listening on port 3000!'));