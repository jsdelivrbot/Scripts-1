

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

//finding a tweet by keyword function
var params = {
    q: 'hello',
	count: 2
}


//Twitter.get('search/tweets',params, gotData);

function gotData(err,data,response){

twitterText.length = 0;
	for (var i = 0; i < data.statuses.length; i++) {
	twitterText.push ( data.statuses[i].text);
	console.log(twitterText[i]);
};


	return twitterText;



}








//GET function
app.get('/', function (req, res) {
    res.render('index', {tweets: null, error: null});

})




//POST function !!!!!WARNING!!!!!
app.post('/' , function(req, res){


var params = {
    q: 'hello',
	count: 2
}

	console.log('city: ' + params.q );

	 params.q = req.body.city;

	console.log('city: ' + params.q );








Twitter.get('search/tweets',params, gotData);

function gotData(err,data,response){

twitterText.length = 0;
	for (var i = 0; i < data.statuses.length; i++) {
	twitterText.push ( data.statuses[i].text);
	console.log(twitterText[i]);
};


	res.render('index', {tweets: twitterText, city:params.q , error: null});



}







	console.log('ttt: '+ twitterText);

	//    
})
 


//Running the server
app.listen(3001, function () {
  console.log(' app listening on port 3001!')
})
