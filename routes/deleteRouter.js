var express = require('express');
var bodyParser = require('body-parser');
var deleteRouter = express.Router({mergeParams : true});
var Image = require('../models/imageModel');
deleteRouter.use(bodyParser.urlencoded({ extended: false }));
deleteRouter.use(bodyParser.json());
deleteRouter.delete('./image/:id',(req,res,next) =>{
    Image.findByIdAndDelete(req.params.id,(err,docs) =>{
        if(!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({status : "Deleted image from database"});
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({err: "The specified id does not exist"});
        }
    });
});

module.exports = deleteRouter;
