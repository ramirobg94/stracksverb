var express = require("express");
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var methodOverride = require('method-override');

var app = express();
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
//console.log(file)
    callback(null, '/mnt/nas');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var storageC = multer.diskStorage({
  destination: function (req, file, callback) {
//console.log(file)
    callback(null, '/mnt/nas/covers');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');
var uploadCover = multer({ storage : storageC}).single('coverPhoto');

app.use(methodOverride('_method'));

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.use(express.static('public'));
app.use('/public', express.static('public'));

app.get('/media/:nombreTrack',function(req,res){
      var nombre = req.params.nombreTrack;
	console.log('/mnt/nas/'+nombre);
	res.sendFile('/mnt/nas/'+nombre);
});
app.get('/media/covers/:nombreTrack',function(req,res){
      var nombre = req.params.nombreTrack;
	console.log('cover : /mnt/nas/covers/'+nombre);
	res.sendFile('/mnt/nas/covers/'+nombre);
});


app.post('/api/photo',function(req,res){
  console.log("alguienLlama");
  var request = req;

   if (request.method == 'POST') {
          var body = '';
  //console.log(request.data);


          request.on('data', function (data) {
              body += data;
          });

          request.on('end', function () {
  console.log(body);
  console.log(body.fieldname);
  console.log("fielName0");
              var post = qs.parse(body);
  console.log(post.file);
  // var postData = req.body;
          //var writeStream = fs.createWriteStream(fileName);
      /*    if(postData)
              console.log(postData);
          else{   
              console.log("failed miserably");
              console.log(postData);
          }*/
          });
      }
  //console.log(req);
  //console.log("alguienLlama2");
      upload(req,res,function(err) {
  //console.log(req);
          if(err) {
              return res.end("Error uploading file.");
          }
          res.end("File is uploaded");
      });
});

app.post('/api/photoCover',function(req,res){
  console.log("alguienLlamaCover");
  var request = req;
   if (request.method == 'POST') {
          var body = '';
          request.on('data', function (data) {
              body += data;
          });
          request.on('end', function () {
  console.log(body);
  console.log(body.fieldname);
  console.log("fielName0");
              var post = qs.parse(body);
  console.log(post.file);
          });
      }
      uploadCover(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          res.end("File is uploaded");
      });
});


app.post('/api/photoRm',function(req,res){
    fs.unlink('./public/digital3a.png',function (err){
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
res.end("File is deleted");

});
});

app.delete('/delete/:trackName',function(req,res){
	console.log("quiere que borre");
	console.log(req.params.trackName);
name = req.params.trackName;

fs.unlink('/mnt/nas/'+ name,function (err){
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
res.end("File is deleted");

});

});



app.listen(3000,function(){
    console.log("Working on port 3000");
});
