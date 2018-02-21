

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

//finding a tweet by keyword function
function getTweets(city){


// find latest tweet according the query 'q' in params
Twitter.get('search/tweets', { q: ( city + ' since:2017-07-11'), count: 10 }, function(err, data, response) {
twitterText.length = 0;
	for (var i = 0; i < data.statuses.length; i++) {
	twitterText.push ( data.statuses[i].text);
};

}) 

		return twitterText;
}








//GET function
app.get('/', function (req, res) {
    res.render('index', {tweets: null, error: null});

})




//POST function !!!!!WARNING!!!!!
app.post('/' , function(req, res){
	  var city = req.body.city;
var rsx=getTweets(city);

     

       
        res.render('index', {tweets: rsx, error: null});
       




//res.render('index', {weather: tText[1], error: null});





})
 


//Running the server
app.listen(3001, function () {
  console.log(' app listening on port 3001!')
})
