

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
var twitterUser = [];
var twitterUserURL =[];
var keyword= null;
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

	 params.q = req.body.keyword;
     params.count = req.body.numberoftweets;


//twitter search function
Twitter.get('search/tweets',params, gotData);

function gotData(err,data,response){

twitterText.length = 0;
twitterUserURL.length=0;
twitterUser.length=0;
	for (var i = 0; i < data.statuses.length; i++) {
	twitterText.push(data.statuses[i].text);
	twitterUser.push(data.statuses[i].user.name);
	twitterUserURL.push(data.statuses[i].user.profile_image_url_https);
	
};

//rendering results in index.ejs
	res.render('index', {tweets: twitterText, keyword:params.q , count:params.count ,twitterUser:twitterUser, twitterUserURL:twitterUserURL, error: null});


}   
})
 


//Running the server
app.listen(3001, function () {
  console.log(' app listening on port 3001!')
})


//v 0.0.0.