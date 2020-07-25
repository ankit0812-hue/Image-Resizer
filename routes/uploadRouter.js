var express = require('express');
var bodyParser = require('body-parser');
var uploadRouter = express.Router();
var Image = require('../models/imageModel');
var multer = require('multer');
var path = require('path');
var sharp = require('sharp');
var imageSize = require('image-size');
uploadRouter.use(bodyParser.urlencoded({ extended: false }));
uploadRouter.use(bodyParser.json());
var storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'images/');
    },
    filename: (req,file,cb) =>{
        cb(null,file.originalname + path.extname(file.originalname));
    }
});
var imageFileFilter = (req,file,cb) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files'),false);
    }
    cb(null,true);

};
var upload = multer({storage:storage,fileFilter:imageFileFilter});
uploadRouter.post('/upload',upload.single('image'),(req,res,next) =>{
    if(req.file) {
     var dimensions = imageSize(req.file.path);
     var height = dimensions.height;
     var width = dimensions.width;
     var aspectRatio = (width/height);
     var newWidth = 800;
     var newHeight = (800/aspectRatio);
     if(newHeight > 800) {
         newHeight = 800;
     }
     
     sharp(req.file.path)
     .resize(newWidth,newHeight)
     .toFile(`resizedimages/${req.file.originalname}`,(err) =>{
         if(!err) {
             console.log("Image resized and saved successfully");
             var newImage = new Image ({
                 image : `${req.file.originalname}`,
                 tag : req.body.tag
             });
             newImage.save()
             .then((image) =>{
                 if(image!=null) {
                     res.statusCode = 200;
                     res.setHeader('Content-Type','application/json');
                     res.json({"id" : image._id});
                 }
                 else {
                     res.statusCode = 403;
                     res.setHeader('Content-Type','application/json');
                     res.json({err: "Something went wrong"});
                 }
             },(err) => next(err))
             .catch((err) =>{
                next(err);
            });
         }
     });
      
    }
});

module.exports = uploadRouter;