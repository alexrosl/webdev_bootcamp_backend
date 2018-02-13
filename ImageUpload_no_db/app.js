var express =   require("express");
var multer  =   require('multer');
var app         =   express();
var fs      = require("fs");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + '/../public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var upload = multer({ storage : storage});
var cpUpload = upload.fields([{ name: 'userPhoto', maxCount: 1 }, {name: 'userPhoto2', maxCount: 1}]);

app.get('/',function(req,res){
      res.render('new');
});

app.get('/show', function(req, res) {
    
    var imageList = []
    fs.readdirSync(__dirname + '/public/uploads').forEach(file => {
      imageList.push('/uploads/'+file);
    })
    res.render('show', {imageList: imageList});
})

app.post('/api/photo', function(req,res){
    cpUpload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.listen(process.env.PORT,function(){
    console.log("Working on port 3000");
});
