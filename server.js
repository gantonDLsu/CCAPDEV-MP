const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { render } = require('ejs');
 

const app = express();

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Hope2714612!', //CHANGE ACCORDING TO YOUR WORKBENCH PASSWORD
    database : 'enteract', // input database name
  });
  
  db.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    else
      console.log('connected as id' + db.threadId);
  });
  

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

let fullname;
let username;
let post;
let fullname_arr = [];
let username_arr = [];
let post_arr = [];
app.get("/", function (req, res){
    res.render("index");
});

app.get("/enteract.ejs", function (req, res){
    res.render("index");
});
app.get("/signup.ejs", function (req, res){
    res.render("signup", {errorMessage: null});
});

app.post("/adduser", function (req, res){
    let data = {
        name: req.body.name, 
        email: req.body.email, 
        username: req.body.username,
        password: req.body.password,
    };

    let sql = "INSERT INTO users SET ?";
    let query = db.query(sql, data, (err, results) => {
        try { if (err) throw err; }
        catch (err) {
            console.log(err);
            res.render("signup", {errorMessage: err});
            return;
        };
        res.redirect("/blogpage.ejs");
    });
});

app.get("/login.ejs", function (req, res){
    res.render("login", {errorMessage: null});
});

app.post("/loginuser", function (req, res) {
    let sql = "SELECT username, password FROM users WHERE username='"+req.body.username+"' AND password='"+req.body.password+"'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;

        if (JSON.stringify(result) == "[]") {
            res.render("login", {errorMessage: "User not found"});
        }
        else {
            res.redirect("/blogpage.ejs");
        }
    });
});

app.get("/aboutus.ejs", function (req, res){
    res.render("aboutus");
});
app.get("/blogpage.ejs", function (req, res){
    res.render("blogpage", { Name: fullname, userName: username});
});

app.post("/posting", function (req, res){
    fullname_arr.push(fullname);
    username_arr.push(username);
    post = req.body.blog-post;
    post_arr.push(post);
    res.render("blogpage", {namePost: fullname_arr, userPost: username_arr, textPost: post_arr});
});

app.listen(3000, () => console.log('listening on port 3000!')); 