const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { render } = require('ejs');
const bcrypt = require('bcrypt');
const multer = require('multer');

const app = express();

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password123', //CHANGE ACCORDING TO YOUR WORKBENCH PASSWORD
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
  
const upload = multer({storage:multer.memoryStorage()});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

let name;
let username;
let userid;
let posts;
let comments = [];
let arr = [];

app.get("/", function (req, res){
    res.render("index");
});

app.get("/enteract.ejs", function (req, res){
    res.render("index");
});
app.get("/signup.ejs", function (req, res){
    res.render("signup", {errorMessage: null});
});


app.post("/adduser", async (req, res) => {
    try {
        // HASHING
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);

        // DATA
        let data = {
            name: req.body.name, 
            email: req.body.email, 
            username: req.body.username,
            password: hashedPassword,
        };
    
        let sql = "INSERT INTO users SET ?";
        let query = db.query(sql, data, (err, results) => {
            try {
                if (err) throw err;
            }
            catch (err) {
                res.render("signup", {errorMessage: err});
                return;
            };
            res.render("login", {errorMessage: "You must login first after signing in."});
        });
    } catch {
        res.status(500).send(0);
    }
});


// app.post("/adduser", function (req, res){
//     let data = {
//         name: req.body.name, 
//         email: req.body.email, 
//         username: req.body.username,
//         password: req.body.password,
//     };

//     let sql = "INSERT INTO users SET ?";
//     let query = db.query(sql, data, (err, results) => {
//         try {
//             if (err) throw err;
//         }
//         catch (err) {
//             res.render("signup", {errorMessage: err});
//             return;
//         };
//         res.render("login", {errorMessage: "You must login first after signing in."});
//     });
// });

app.get("/login.ejs", function (req, res){
    res.render("login", {errorMessage: null});
});

app.post("/loginuser", (req, res) => {
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
            res.redirect("blogpage.ejs");
        };
    });
});

app.get("/blogpage.ejs", function (req, res) {
    let query = db.query ("SELECT username FROM users", (err, result) => {
        if (err) throw err;
        result.forEach(element => { arr.push(element.username); });
        arr.sort((a, b) => 0.5 - Math.random()).splice(3);

        let postquery = db.query("SELECT * FROM posts ORDER BY datetime DESC", (err, postresults) => {
            posts = postresults;
            let commentquery = db.query("SELECT * FROM usercomments", (err, commentresults) => {
                comments = commentresults;
                res.render("blogpage", {Name : name, userName : username, posts: posts, comments: comments, toFollow: arr, isEditingPost: false});
            });
        });
    });
});

app.get("/aboutus.ejs", function (req, res){
    res.render("aboutus");
});

app.post("/posting", upload.single('media'), function (req, res){
    const today = new Date();
    let data = {
        username: username,
        name: name,
        message: req.body.message,
        datetime: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds(),
        media: req.file.buffer.toString('base64'),
        mediatype: req.file.mimetype
    };
    let sql = "INSERT INTO posts SET ?";
    let query = db.query(sql, data, (err, results) => {
        if (err) throw err;
        let postquery = db.query("SELECT * FROM posts ORDER BY postid DESC", (err, results) => {
            posts = results;
            res.redirect("blogpage.ejs");
        });
    });
});

app.post("/addcomment:postid", function (req, res){
    let data = {
        postid: parseInt(req.params.postid.slice(1)),
        name: name,
        comment: req.body.comment
    };
    let query = db.query("INSERT INTO usercomments SET ?", data, (err, results) => {
        if (err) throw err;
        let commentquery = db.query("SELECT * FROM usercomments", (err, commentresults) => {
            comments = commentresults;
            res.redirect("blogpage.ejs");
        });
    })
});

app.post("/deletepost:postid", function (req, res){
    let data = {
        postid: parseInt(req.params.postid.slice(1))
    };
    let deletecomments = db.query("DELETE FROM usercomments WHERE ?", data, (err, result) => {
        if (err) throw err;
        let commentquery = db.query("SELECT * FROM usercomments", (err, results) => {
            comments = results;
        });
    });
    let query = db.query("DELETE FROM posts WHERE ?", data, (err, result) => {
        if (err) throw err;
        let postquery = db.query("SELECT * FROM posts ORDER BY postid DESC", (err, results) => {
            posts = results;
            res.redirect("blogpage.ejs");
        });
    });
});

app.post("/deletecomment:commentid", function (req, res){
    let data = {
        commentid: parseInt(req.params.commentid.slice(1))
    };
    let deletecomments = db.query("DELETE FROM usercomments WHERE ?", data, (err, result) => {
        if (err) throw err;
        let commentquery = db.query("SELECT * FROM usercomments", (err, results) => {
            comments = results;
            res.redirect("blogpage.ejs");
        });
    });
});

app.post("/editpost:postid", function (req, res){
    let data = {
        postid: parseInt(req.params.postid.slice(1))
    };
    let editpost = db.query("SELECT * FROM posts WHERE ?", data, (err, result) => {
        if (err) throw err;

        res.render("blogpage", {Name : name, userName : username, posts: posts, comments: comments, toFollow: arr, isEditingPost: true, editPostID: result[0].postid, editPostMessage: result[0].message});
    })
});

app.post("/updatepost:postid", function (req, res){
    let data = {
        postid: parseInt(req.params.postid.slice(1))
    };
    let sql = "UPDATE posts SET message = \"" + req.body.message + "\" WHERE ?";
    let editpost = db.query(sql, data, (err, result) => {
        if (err) throw err;
    });
    res.redirect("blogpage.ejs");
});

app.listen(3000, () => console.log('listening on port 3000!')); 