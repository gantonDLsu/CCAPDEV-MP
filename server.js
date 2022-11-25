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

let name;
let username;
let post;
let fullname_arr = [];
let username_arr = [];
let post_arr = [];
let userid;

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
        try {
            if (err) throw err;
        }
        catch (err) {
            console.log(err);
            res.render("signup", {errorMessage: err});
            return;
        };
        res.render("login", {errorMessage: "You must login first after signing in."});
    });
});

app.get("/login.ejs", function (req, res){
    res.render("login", {errorMessage: null});
});

app.post("/loginuser", function (req, res) {
    let sql = "SELECT * FROM users WHERE username='"+req.body.username+"' AND password='"+req.body.password+"'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;

        if (JSON.stringify(result) == "[]") {
            res.render("login", {errorMessage: "User not found"});
        }
        else {
            name = result[0].name;
            username = result[0].username;
            userid = result[0].userid;
            res.render("blogpage", {Name : name, userName : username, textPost: post_arr});
        }
    });
});

app.get("/aboutus.ejs", function (req, res){
    res.render("aboutus");
});

app.post("/adduser", function (req, res){
    const today = new Date();
    let data = {
        user: userid,
        message: req.body.message,
        datetime: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds(),
        likes: 0
    };
    let sql = "INSERT INTO posts SET ?";
    let query = db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.render("blogpage", {Name: name, userName: username, textPost: post_arr});
    });
});


// app.post("/posting", function (req, res){
//     fullname_arr.push(fullname);
//     username_arr.push(username);
//     post = req.body.blog-post;
//     post_arr.push(post);
//     res.render("blogpage", {namePost: fullname_arr, userPost: username_arr, textPost: post_arr});
// });

app.listen(3000, () => console.log('listening on port 3000!')); 
