//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


mongoose.connect("mongodb://127.0.0.1/testDB", {

  // const password = "Test123"
  // mongoose.connect("mongodb+srv://admin-kevinjs:" + password + "@cluster0-gh5eh.mongodb.net/blogDB", {

  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//SCHEMAS

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})


const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = mongoose.model("user", userSchema)



//gets

app.get("/", function(req, res) {

  // console.log(req); //the get request from client

  res.render("home");

});

app.get("/login", function(req, res) {

  // console.log(req); //the get request from client

  res.render("login");

});

app.get("/register", function(req, res) {

  // console.log(req); //the get request from client

  res.render("register");

});


//posts

app.post("/", function(req, res) {

  console.log(req.body); //the post request from client -- POST form -- an object

});

app.post("/register", function(req, res) {

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });

});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.find({
    email: username
  }, function(err, results) {
    if (!err) {

      if (results.password === password) {
        res.render("secrets");
      } else {
        res.send("Wrong password")
      }
    } else {
      console.log(err);
    }
  })
})







app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//// WHEN CONNECTED TO MONGOOSE
// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
//
// app.listen(port, function() {
//   console.log("Server started on port 3000");
// });
