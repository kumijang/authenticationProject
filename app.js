//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express();

console.log(process.env.SERCRET)

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));
const userSchema = new mongoose.Schema({
    email: String,
    password:String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']})
const User = new mongoose.model("User", userSchema);

app.use(express.static("public"))
app.set("view engine", 'ejs')
app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/register",(req,res)=>{
    res.render("register")
})


app.post("/register", async (req, res) => {
    try {
      const newUser = new User({
        email: req.body.username,
        password: req.body.password,
      });
      await newUser.save();
      res.render("secrets");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error registering user.");
    }
  });
  
  app.post("/login",async (req,res)=>{
    try {
        const username = req.body.username
        const password = req.body.password
        const foundUser = await User.findOne({ email: username });
        if (foundUser) {
          if (foundUser.password === password)
          res.render("secrets")
        } else {
          // User not found
          console.log("user not found");
        }
      } catch (err) {
        // Handle error
        console.log(err);
      }
  })


app.listen(3000,()=>{
    console.log("Server Starting in port 3000.");
})