var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var uploadRouter = require('./routes/uploadRouter');
var getRouter = require('./routes/getRouter');
var deleteRouter= require('./routes/deleteRouter');
var modifyRouter = require('./routes/modifyRouter');
var app = express();
app.use(bodyParser.json());
var url = "mongodb://localhost:27017/images";
mongoose.connect(url,() =>{
    console.log("Connected to database");
});
var portname = 'localhost';
app.use('/functions',uploadRouter);
app.use('/functions',getRouter);
app.use('/functions',modifyRouter);
app.use('/functions',deleteRouter);
app.listen(3000,portname,() =>{
    console.log('Connected correctly to server');
});