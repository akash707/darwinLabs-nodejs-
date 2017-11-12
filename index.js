var express = require('express');
var app=express();
var bodyParser=require('body-parser');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var cloudinary = require('cloudinary');
var darwin=require('./models/model');
var mongoose=require('mongoose');
var path    = require("path");

var port = process.env.PORT || 8000;


//
// cloudinary.config({
//   cloud_name: '**',
//   api_key: '**',
//   api_secret: '***'
// })


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))


mongoose.connect("mongodb://akash:akash@ds259255.mlab.com:59255/darwins",{useMongoClient: true});
mongoose.Promise=global.Promise;


app.listen(8000);
app.set('view engine', 'ejs');




app.get('/home',function(req,res)
{
  res.sendFile(path.join(__dirname+'/index.html'));
});



app.post('/data/:id',function(req,res)
{
var name=req.params.id;

url = 'https://www.google.co.in/search?q='+ name + '&source=lnms&tbm=isch';

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
const $ = cheerio.load(html);

var url=[];

$('img').each(function(i, elem) {
  url.push($(elem).attr('src'));
});

var image_url=(url.slice(0,15));



var file_name=[];

for(var i=0;i<image_url.length;i++)
{
  request(image_url[i]).pipe(fs.createWriteStream('public/images/'+ name + (i+1)+'.png'));
//   cloudinary.uploader.upload(image_url[i], function(result) {
//   console.log(result)
// });
file_name.push(name+(i+1)+'.png')
}


var image=new darwin();
image.search_keyword=name;
image.search_results=file_name;
image.save(function(error,result)
{
}
);
res.send(image_url);


  }
});



}
);



app.get('/search',function(req,res)
{
darwin.find({}).then(function(results)
{
res.render('search_keyword_results',{title:'All Searched Keywords',data:results});
}
)
}
);



app.get('/search/:id',function(req,res)
{
darwin.find({search_keyword:req.params.id}).then(function(results)
{
res.render('search_keyword_images',{title:'Your Result For: ',data:results,keyword:req.params.id});
}
)
}
);



app.get('*',function(req,res)
{
res.redirect('/home');
});
