var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var getRouter = express.Router({mergeParams: true});
var Image = require('../models/imageModel');
var sharp = require('sharp');
getRouter.use(bodyParser.urlencoded({ extended: false }));
getRouter.use(bodyParser.json());
getRouter.get('/image/:id/resize',(req,res,next) =>{
    Image.findById(req.params.id)
    .then((entry) =>{
        console.log(path.join('./' ,entry.image));
        if(entry!=null) {
            var height = req.query.height; 
            var width = req.query.width;
            sharp(path.join('./resizedimages' ,entry.image))
            .resize(parseInt(width),parseInt(height))
            .toBuffer()
            .then((data) =>{
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': data.length
                });
                return (res.end(data));
            },(err) => next(err))
            .catch((err) =>{
                next(err);
            });
        }
        else {
            res.statusCode = 403;
            res.setHeader("Content-Type",'application/json');
            res.json({err: "The specified id does not exist"});
        }
    },(err) => next(err))
    .catch((err) =>{
        next(err);
    });
});

getRouter.get('/image/:id/crop',(req,res,next) => {
    Image.findById(req.params.id)
    .then((entry) =>{
        if(entry!=null) {
            var imgheight = req.query.height; 
            var imgwidth = req.query.width;
            sharp(path.join('./resizedimages' ,entry.image))
            .extract({width: parseInt(imgwidth),height: parseInt(imgheight),left: 60,top: 40})
            .toBuffer()
            .then((data) =>{
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': data.length
                });
                return (res.end(data));
            },(err) => next(err))
            .catch((err) =>{
                next(err);
            });
        }
        else {
            res.statusCode = 403;
            res.setHeader("Content-Type",'application/json');
            res.json({err: "The specified id does not exist"});
        }
    },(err) => next(err))
    .catch((err) =>{
        next(err);
    });
        
});

getRouter.get('/images/:tag',(req,res,next) =>{
    Image.find({tag : req.params.tag}).then((data) => {
        return res.json({
            error: false,
            data
        }).status(200);
    }).catch((error) => {
        return res.json({
            error: true
        }).status(200)
    })
})

module.exports = getRouter;
