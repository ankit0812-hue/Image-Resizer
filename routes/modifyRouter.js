var express = require('express');
var bodyParser = require('body-parser');
var modifyRouter = express.Router({mergeParams : true});
var Image = require('../models/imageModel');
modifyRouter.use(bodyParser.urlencoded({ extended: false }));
modifyRouter.use(bodyParser.json());
modifyRouter.put('/image/:id',(req,res,next) =>{
    Image.findByIdAndUpdate(req.params.id,{tag : req.query.tag},(err,docs) =>{
        if(!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({status: "Successfully modified"});
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({err: "The specified id does not exist"});
        }
    });
});

module.exports = modifyRouter;