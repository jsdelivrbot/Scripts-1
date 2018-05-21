

//importing components
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sentiment = require('sentiment');
const app = express()
var firebase = require("firebase-admin");





  var config = {
    // apiKey: "AIzaSyCIFo1xJpg-jdSmRK8dCSOUeahJsM1pgaA",
    // authDomain: "sentiment-analisis-twitter.firebaseapp.com",
    serviceAccount : "./sentiment-analisis-twitter-firebase-adminsdk-i6qim-d7b5b2f868.json",
    databaseURL: "https://sentiment-analisis-twitter.firebaseio.com",
    credential: {
      getAccessToken: () => ({
        expires_in: 0,
        access_token: '',
      }),
    }

    // projectId: "sentiment-analisis-twitter",
    // storageBucket: "sentiment-analisis-twitter.appspot.com",
    // messagingSenderId: "692009161137
      };
  firebase.initializeApp(config);
  console.log(firebase);
// var rootRef = firebase.database().ref().child('sentiment-analisis-twitter');
var tweetsRef = firebase.database().ref().child('tweets');

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
var twitterPositive = [];
var twitterNegative = [];
var twitterLang;
var keyword= null;
var rsx=[];


var port = process.env.PORT || 8000







//declaring the searching parameters
var params = {
    q: 'hello',
  tweet_mode:'extended'
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
  tweet_mode:'extended'
}

	 params.q = req.body.keyword;
     params.count = req.body.numberoftweets;
     switch(req.body.selectLanguageButton){
     	case 'Romanian':
                 twitterLang = 'ro'
     						break;
     	case 'English': 
                twitterLang = 'en'
     						break;
     	default : break;										

     }


//twitter search function
Twitter.get('search/tweets',params, gotData);

function gotData(err,data,response){

//write to db
twitterSentimentScore.length = 0 ;
twitterPositive.length = 0;
twitterNegative.length = 0;


	for (var i = 0; i < params.count; i++) {
		console.log('franc');
         var languageDB = tweetsRef.child(params.q);




			if (data.statuses[i].lang === twitterLang) {
         languageDB.child(data.statuses[i].id).set(data.statuses[i]);
	 }
};



twitterText.length = 0;
twitterUserURL.length=0;
twitterUser.length=0;
twitterPositive.length = 0;
twitterNegative.length = 0;


languageDB.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
    var childKey = childSnapshot.key;
if(twitterText.length >= params.count){
    return true;

}
    if (childData.lang === twitterLang) {
if(childData.full_text != undefined){
     twitterText.push(childData.full_text);
        twitterSentimentScore.push(sentiment(childData.full_text).score);
   twitterNegative.push(sentiment(childData.full_text).negative.join("|"));
    twitterNegative = twitterNegative.filter(v=>v!='');
        twitterPositive.push(sentiment(childData.full_text).positive.join("|"));
        twitterPositive = twitterPositive.filter(v=>v!='');
       
      console.log(sentiment(childData.full_text).log);

}else{
   twitterSentimentScore.push(sentiment(childData.text).score);
      twitterText.push(childData.text);
         twitterNegative.push(sentiment(childData.text).negative.join("|"));
         twitterNegative = twitterNegative.filter(v=>v!='');
        twitterPositive.push(sentiment(childData.text).positive.join("|"));
        twitterPositive = twitterPositive.filter(v=>v!='');

      console.log(sentiment(childData.full_text).log);


}

         

         twitterUser.push(childData.user.name);
         twitterUserURL.push(childData.user.profile_image_url_https);

       }
     
            });

        });

          var sortedEmotions = sortEmotions(twitterSentimentScore);




//  var stream = Twitter.stream('statuses/filter', { track: params.q })
// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })




//rendering results in index.ejs
	res.render('index', {tweets: twitterText, keyword:params.q , count:params.count ,twitterUser:twitterUser, twitterUserURL:twitterUserURL,twitterSentimentScore:twitterSentimentScore,sortedEmotions:sortedEmotions,twitterNegative:twitterNegative,twitterPositive:twitterPositive,error: null});
twitterPositive.length = 0;
twitterNegative.length = 0;

}   
})
 

function sortEmotions(emotionsArray){
  var sortedEmotions = {
 positiveEmotions : 0,
 neutralEmotions : 0,
 negativeEmotions : 0
};

for (var i = 0; i <=emotionsArray.length; i++) {
if (emotionsArray[i]>0) {
  sortedEmotions.positiveEmotions++;
} else if (emotionsArray[i]<0){
  sortedEmotions.negativeEmotions++;
}else{
  sortedEmotions.neutralEmotions++;
}
}

return sortedEmotions;

}




//Running the server
app.listen(port, function () {
  console.log(' app listening on port 8000!')
})


//v 0.0.0.