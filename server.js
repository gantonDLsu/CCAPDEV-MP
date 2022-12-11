const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { render } = require('ejs');
const bcrypt = require('bcrypt');
const multer = require('multer');
const session = require('express-session');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123', //CHANGE ACCORDING TO YOUR WORKBENCH PASSWORD
    database: 'enteract', // input database name
});

db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    else
        console.log('connected as id' + db.threadId);
});

const upload = multer({ storage: multer.memoryStorage() });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

let posts;
let comments = [];
let arr = [];

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.get("/", function (req, res) {
    req.session.loggedin = false;
    res.render("index");
});

app.get("/enteract.ejs", function (req, res) {
    req.session.loggedin = false;
    res.render("index");
});
app.get("/signup.ejs", function (req, res) {
    res.render("signup", { errorMessage: null });
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
                res.render("signup", { errorMessage: err });
                return;
            };
            res.render("login", { errorMessage: "You must login first after signing in." });
        });
    } catch {
        res.status(500).send(0);
    }
});


// -------------- (old code) w/o hash matching --------------
// app.post("/adduser", async (req, res) => {
//     try {
//         // HASHING
//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);
//         console.log(salt);
//         console.log(hashedPassword);

//         // DATA
//         let data = {
//             name: req.body.name, 
//             email: req.body.email, 
//             username: req.body.username,
//             password: hashedPassword,
//         };

//         let sql = "INSERT INTO users SET ?";
//         let query = db.query(sql, data, (err, results) => {
//             try {
//                 if (err) throw err;
//             }
//             catch (err) {
//                 res.render("signup", {errorMessage: err});
//                 return;
//             };
//             res.render("login", {errorMessage: "You must login first after signing in."});
//         });
//     } catch {
//         res.status(500).send(0);
//     }
// });

// -------------- (old code) w/o hashing --------------
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


app.get("/login.ejs", function (req, res) {
    req.session.loggedin = false;
    res.render("login", { errorMessage: null });
});

app.post("/loginuser", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // checks for username and pw
    if (username && password) {
        db.query('SELECT * FROM users WHERE username= ?', [username], (err, userGate) => {
            if (err) throw err;
            // checks user in db
            else if (userGate.length > 0) {
                db.query('SELECT * FROM users WHERE username= ?', [username], (err, passGate) => {
                    if (err) throw err;
                    bcrypt.compare(password, passGate[0].password, (err, matched) => {
                        if (err) throw err;
                        else if (matched) {
                            req.session.loggedin = true;
                            req.session.username = username;
                            req.session.name = userGate[0].name;
                            // put session ID in data base.
                            res.redirect("blogpage.ejs");
                        }
                        else
                            res.send('Username or Password is Incorrect!');
                    });
                });
            }
            else
                res.send('Username or Password is Incorrect!');
        });
    }
});


// -------------- (old code) w/o hashing --------------
// app.post("/loginuser", (req, res) => {
//     let sql = "SELECT * FROM users WHERE username='"+req.body.username+"' AND password='"+req.body.password+"'";
//     let query = db.query(sql, (err, result) => {
//         if (err) throw err;

//         if (JSON.stringify(result) == "[]") {
//             res.render("login", {errorMessage: "User not found"});
//         }
//         else {
//             name = result[0].name;
//             username = result[0].username;
//             userid = result[0].userid;
//             req.session.loggedin = true;
//             req.session.username = username;
//             res.redirect("blogpage.ejs");
//         };
//     });
// });


app.get("/blogpage.ejs", function (req, res) {
    if (req.session.loggedin) { // && rq.sessionID 
        let query = db.query("SELECT username FROM users", (err, result) => {
            if (err) throw err;
            result.forEach(element => { arr.push(element.username); });
            arr.sort((a, b) => 0.5 - Math.random()).splice(3);

            let postquery = db.query("SELECT * FROM posts ORDER BY datetime DESC", (err, postresults) => {
                posts = postresults;
                let commentquery = db.query("SELECT * FROM usercomments", (err, commentresults) => {
                    comments = commentresults;
                    res.render("blogpage", { Name: req.session.name, userName: req.session.username, posts: posts, comments: comments, toFollow: arr, isEditingPost: false, sessionAvail: req.session.loggedin });
                });
            });
        });
    }
    else {
        res.redirect("/login.ejs");
    }
});

app.get("/viewblogpage.ejs", function (req, res) {
    // need session wherein user has no account and would only view the blogs
    // when trying to click or interact with a post would redirect to login/sign up page

    let query = db.query("SELECT username FROM users", (err, result) => {
        if (err) throw err;
        result.forEach(element => { arr.push(element.username); });
        arr.sort((a, b) => 0.5 - Math.random()).splice(3);

        let postquery = db.query("SELECT * FROM posts ORDER BY datetime DESC", (err, postresults) => {
            posts = postresults;
            let commentquery = db.query("SELECT * FROM usercomments", (err, commentresults) => {
                comments = commentresults;
                res.render("blogpage", { Name: req.session.name, userName: req.session.username, posts: posts, comments: comments, toFollow: arr, isEditingPost: false, sessionAvail: req.session.loggedin });
            });
        });
    });
    // res.render("viewblogpage", {Name : name, userName : username, posts: posts, comments: comments, toFollow: arr, isEditingPost: false});
});

app.get("/aboutus.ejs", function (req, res) {
    res.render("aboutus");
});

app.post("/posting", upload.single('media'), function (req, res) {
    const today = new Date();
    let data;

    if (req.file != null) {
        data = {
            username: req.session.username,
            name: req.session.name,
            message: req.body.message,
            datetime: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
            media: req.file.buffer.toString('base64'),
            mediatype: req.file.mimetype
        };
    }
    else {
        data = {
            username: req.session.username,
            name: req.session.name,
            message: req.body.message,
            datetime: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
        };
    }


    let sql = "INSERT INTO posts SET ?";
    let query = db.query(sql, data, (err, results) => {
        if (err) throw err;
        let postquery = db.query("SELECT * FROM posts ORDER BY postid DESC", (err, results) => {
            posts = results;
            res.redirect("blogpage.ejs");
        });
    });
});

app.post("/addcomment:postid", function (req, res) {
    let data = {
        postid: parseInt(req.params.postid.slice(1)),
        name: req.session.name,
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

app.post("/deletepost:postid", function (req, res) {
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

app.post("/deletecomment:commentid", function (req, res) {
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

app.post("/editpost:postid", function (req, res) {
    let data = {
        postid: parseInt(req.params.postid.slice(1))
    };
    let editpost = db.query("SELECT * FROM posts WHERE ?", data, (err, result) => {
        if (err) throw err;

        res.render("blogpage", { Name: req.session.name, userName: username, posts: posts, comments: comments, toFollow: arr, isEditingPost: true, editPostID: result[0].postid, editPostMessage: result[0].message });
    })
});

app.post("/updatepost:postid", function (req, res) {
    let data = {
        postid: parseInt(req.params.postid.slice(1))
    };
    let sql = "UPDATE posts SET message = \"" + req.body.message + "\" WHERE ?";
    let editpost = db.query(sql, data, (err, result) => {
        if (err) throw err;
    });
    res.redirect("blogpage.ejs");
});

app.post("/sharepost:postid", function (req, res) {
    let sharedata = {
        postid: parseInt(req.params.postid.slice(1))
    };
    let sharequery = db.query("SELECT * FROM posts WHERE ?", sharedata, (err, results) => {
        if (err) throw err;
        const today = new Date();
        let data = {
            username: results[0].username,
            name: results[0].name,
            message: results[0].message,
            datetime: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
            media: results[0].media,
            mediatype: results[0].mediatype,
            usershare: req.session.name
        }

        let postquery = db.query("INSERT INTO posts SET ?", data, (err, results) => {
            if (err) throw err;
            posts = results;
            res.redirect("blogpage.ejs");
        });
    });
});

app.listen(3000, () => console.log('listening on port 3000!')); 