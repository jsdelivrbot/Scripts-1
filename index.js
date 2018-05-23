

//importing components
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sentiment = require('sentiment');
const app = express()
var server = require('http').createServer(app);  
var io = require('socket.io')(server);






  
// var rootRef = firebase.database().ref().child('sentiment-analisis-twitter');

//setting  up express and ejs 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

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
var fullTwitterText="";


var port = process.env.PORT || 8000







//declaring the searching parameters
var params = {
    q: 'hello',
  tweet_mode:'extended',
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
twitterText.length = 0;
twitterUserURL.length=0;
twitterUser.length=0;
twitterPositive.length = 0;
twitterNegative.length = 0;


	for (var i = 0; i < params.count; i++) {
			if (data.statuses[i].lang === twitterLang) {
        if(data.statuses[i].full_text != undefined){
  twitterText.push(data.statuses[i].full_text);
  fullTwitterText.concat(fullTwitterText,data.statuses[i].full_text);
  twitterSentimentScore.push(sentiment(data.statuses[i].full_text).score);
  twitterUser.push(data.statuses[i].user.name);
  twitterUserURL.push(data.statuses[i].user.profile_image_url_https);
twitterNegative.push(sentiment(data.statuses[i].full_text).negative.join("|"));
    twitterNegative = twitterNegative.filter(v=>v!='');
        twitterPositive.push(sentiment(data.statuses[i].full_text).positive.join("|"));
        twitterPositive = twitterPositive.filter(v=>v!='');
    }else{
  twitterText.push(data.statuses[i].text);
    fullTwitterText.concat(fullTwitterText,data.statuses[i].text);

  twitterSentimentScore.push(sentiment(data.statuses[i].text).score);
  twitterUser.push(data.statuses[i].user.name);
  twitterUserURL.push(data.statuses[i].user.profile_image_url_https);
twitterNegative.push(sentiment(data.statuses[i].text).negative.join("|"));
    twitterNegative = twitterNegative.filter(v=>v!='');
        twitterPositive.push(sentiment(data.statuses[i].text).positive.join("|"));
        twitterPositive = twitterPositive.filter(v=>v!='');


  }

  	 }
};
 console.log("ass"+fullTwitterText);


          var sortedEmotions = sortEmotions(twitterSentimentScore);



 var stream = Twitter.stream('statuses/filter', { track: params.q })
stream.on('stream', function (stream) {
io.sockets.emit('tweets', stream.text); 
console.log(stream.text);
});




function nthMostCommon(string, ammount) {
    var wordsArray = string.split(/\s/);
    var wordOccurrences = {}
    for (var i = 0; i < wordsArray.length; i++) {
        wordOccurrences['_'+wordsArray[i]] = ( wordOccurrences['_'+wordsArray[i]] || 0 ) + 1;
    }
    var result = Object.keys(wordOccurrences).reduce(function(acc, currentKey) {
        /* you may want to include a binary search here */
        for (var i = 0; i < ammount; i++) {
            if (!acc[i]) {
                acc[i] = { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] };
                break;
            } else if (acc[i].occurences < wordOccurrences[currentKey]) {
                acc.splice(i, 0, { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] });
                if (acc.length > ammount)
                    acc.pop();
                break;
            }
        }
        return acc;
    }, []);
    return result;
}





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
server.listen(port, function () {
  console.log(' app listening on port 8000!')
})


//v 0.0.0.