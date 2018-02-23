

//importing components
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()


//setting  up express and ejs 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

//seting up Twit
var twit = require('twit'),
 config = require('./config');

var Twitter = new twit(config);
var twitterText = [];
var city= null;
var rsx=[];

//declaring the searching parameters
var params = {
    q: 'hello',
	count: 2
}










//GET function
app.get('/', function (req, res) {
    res.render('index', {tweets: null, error: null});

})




//POST function 
app.post('/' , function(req, res){


var params = {
    q: 'hello',
	count: 2
}

	 params.q = req.body.city;
     params.count = req.body.numberoftweets;


//twitter search function
Twitter.get('search/tweets',params, gotData);

function gotData(err,data,response){

twitterText.length = 0;
	for (var i = 0; i < data.statuses.length; i++) {
	twitterText.push ( data.statuses[i].text);
};

//rendering results in index.ejs
	res.render('index', {tweets: twitterText, city:params.q , error: null});


}   
})
 


//Running the server
app.listen(3001, function () {
  console.log(' app listening on port 3001!')
})


//v 0.0.0.4