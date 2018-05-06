

//importing components
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sentiment = require('sentiment');
const app = express()
var firebase = require('firebase-admin');




var config = {
    apiKey: "AIzaSyCIFo1xJpg-jdSmRK8dCSOUeahJsM1pgaA",
    authDomain: "sentiment-analisis-twitter.firebaseapp.com",
    databaseURL: "https://sentiment-analisis-twitter.firebaseio.com",
    projectId: "sentiment-analisis-twitter",
    storageBucket: "sentiment-analisis-twitter.appspot.com",
    messagingSenderId: "692009161137"
  };
  firebase.initializeApp(config);

var ref= firebase.database().ref('sentiment-analisis-twitter');
var tweetsRef = ref.child('tweets');

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
var twitterSentimentScore = [];
var twitterLang;
var keyword= null;
var rsx=[];


var port = process.env.PORT || 8000







//declaring the searching parameters
var params = {
    q: 'hello',
	count: 2,
	//lang:'en'
}










//GET function
app.get('/', function (req, res) {
    res.render('index', {tweets: null, error: null});

})




//POST function 
app.post('/' , function(req, res){


var params = {
    q: 'hello',
	count: 2,
	//lang:'en'
}

	 params.q = req.body.keyword;
     params.count = req.body.numberoftweets;
     switch(req.body.selectLanguageButton){
     	case 'Romanian': twitterLang = 'ro'
     						break;
     	case 'English' : twitterText = 'en'
     						break;
     	default : break;										

     }


//twitter search function
Twitter.get('search/tweets',params, gotData);

function gotData(err,data,response){

twitterText.length = 0;
twitterUserURL.length=0;
twitterUser.length=0;
twitterSentimentScore.length = 0 ;
	for (var i = 0; i < data.statuses.length; i++) {
		console.log('franc');

		tweetsRef.push({
				hello:'it works'
			});

		var snetimentScore = sentiment(data.statuses[i].text);
		console.log(snetimentScore);
		if (data.statuses[i].lang === twitterLang) {
			
	twitterText.push(data.statuses[i].text);
	twitterSentimentScore.push(snetimentScore.score);
	twitterUser.push(data.statuses[i].user.name);
	twitterUserURL.push(data.statuses[i].user.profile_image_url_https);
	}
};

//rendering results in index.ejs
	res.render('index', {tweets: twitterText, keyword:params.q , count:params.count ,twitterUser:twitterUser, twitterUserURL:twitterUserURL,twitterSentimentScore:twitterSentimentScore, error: null});


}   
})
 


//Running the server
app.listen(port, function () {
  console.log(' app listening on port 8000!')
})


//v 0.0.0.