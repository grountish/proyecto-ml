const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary.js').v2;;
const bodyParser = require('body-parser');

router.use(bodyParser.json({ limit: '50000mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '50000mb' }));



const Picture = require('../models/picture.js');

router.get('/', function(req, res, next) {
  Picture.find()
    .then(pictures => {
      res.render('index', { pictures });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/picture/add', (req, res, next) => {
  res.render('picture-add');
});


router.post('/picture/add', (req, res, next) => {

 dataImg = req.body[0].imageData; 
 //uploadCloud.single(data)
  Picture.create({data:dataImg})
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      console.log(error);
    });

});
 
// router.post('/picture/add', function (req, res) {
 
//   var dataURI = req.body[0].imageData;
//   var uploadStr = 'data:image/jpeg;base64,' + dataURI;

//   cloudinary.v2.uploader.upload(uploadStr, {
//       overwrite: true,
//       invalidate: true,
//       width: 810, height: 456, crop: "fill"
//   },
//       function (error, result) {
//           res.json(result);
//       });
// });


module.exports = router;
