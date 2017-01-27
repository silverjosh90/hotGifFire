var jenkinsapi = require('jenkins-api');
var opener = require('opener')
var pkill = require('pkill')
var jenkins;
var firstTime = false;
var aborted = false;
var waiting = false;
var success = false;
var failure = false;
var sum = 0;
var status = "";

/* Gif Files */
var abortedGif = [
  "http://giphy.com/gifs/idk-shrug-power-rangers-y65VoOlimZaus/fullscreen",
  "http://giphy.com/gifs/homer-simpson-4RnQeOgXXv3na/fullscreen",
  "http://giphy.com/gifs/u8r8ft8exHGso/fullscreen",
  "http://giphy.com/gifs/VsnV5LE3gLjkQ/fullscreen",
  "http://giphy.com/gifs/the-matrix-rWY9ySfjytitq/fullscreen",
  "http://giphy.com/gifs/fail-awkward-fox-sports-uIeAJ5LVIQ5ji/fullscreen",
  "http://giphy.com/gifs/batman-quotes-yyhJaoPDhCbBu/fullscreen"
]
var waitingGif = [
  "http://giphy.com/gifs/26gsvogX9m2Lk7twA/fullscreen",
  "http://giphy.com/gifs/adventure-time-question-thinking-MJTOHmGiGPHgI/fullscreen",
  "http://giphy.com/gifs/mr-burns-5nFShZWwq3fdm/fullscreen",
  "http://giphy.com/gifs/o5oLImoQgGsKY/fullscreen",
  "http://giphy.com/gifs/foxhomeent-fight-club-fhe-l3vRjYScjR00oyjMA/fullscreen",
  "http://giphy.com/gifs/animation-loop-space-3oriOiizS4Pmofj46A/fullscreen",
  "http://giphy.com/gifs/bored-tired-fight-club-Dbo31UlQgVIdO/fullscreen",
  "http://giphy.com/gifs/reaction-seinfeld-elaine-benes-iW8tsoJWcfPc4/fullscreen"
]
var successGif = [
  "http://giphy.com/gifs/green-ranger-walking-l3q2TF4pshyJVjVMA/fullscreen",
  "http://giphy.com/gifs/excited-dance-party-OSWRJKmwUEOD6/fullscreen",
  "http://giphy.com/gifs/always-sunny-NPDJzO3ZGDMMo/fullscreen",
  "http://giphy.com/gifs/hulu-fxx-its-always-sunny-in-philadelphia-3o7TKGy6TBUPrjtQLC/fullscreen",
  "http://giphy.com/gifs/happy-excited-spongebob-squarepants-8WJw9kAG3wonu/fullscreen",
  "http://giphy.com/gifs/bubbles-trailer-park-boys-mike-smith-wysyxWt4ZlQ9q/fullscreen",
  "http://giphy.com/gifs/bobs-burgers-made-by-me-RwsWFmDA299YY/fullscreen",
  "http://giphy.com/gifs/hot-cheetos-daydreamer69-afjEq94tOL1Li/fullscreen",
  "http://giphy.com/gifs/PFT49iGCp0FBm/fullscreen"
]
var failureGif = [
  "http://giphy.com/gifs/red-ranger-drink-fail-l3q2PoTK6ZbyoqP6g/fullscreen",
  "http://giphy.com/gifs/hp-escape-enemy-jou4Cd2mx1lGU/fullscreen",
  "http://giphy.com/gifs/lemongrab-g07r8N3WiKDny/fullscreen",
  "http://giphy.com/gifs/80s-pee-wee-herman-favorite-show-IoXVrbzUIuvTy/fullscreen",
  "http://giphy.com/gifs/archer-slabofsploosh-krieger-QiLFiIgj8n3r2/fullscreen",
  "http://giphy.com/gifs/hot-sun-sunny-xT0Gqz4x4eLd5gDtaU/fullscreen",
  "http://giphy.com/gifs/spongebob-squarepants-sad-OPU6wzx8JrHna/fullscreen",
  "http://giphy.com/gifs/ycagKBYEmaili/fullscreen",
  "http://giphy.com/gifs/bLzi2T7kipXRC/fullscreen",
  "http://giphy.com/gifs/bobs-burgers-fox-bobs-burgers-tv-3o72Fc3KQIe68EnphS/fullscreen",
  "http://giphy.com/gifs/daria-cartoon-10Iu43S5QuBTMc/fullscreen",
  "http://giphy.com/gifs/angeles-bachcaps-bearfighting-RFDXes97gboYg/fullscreen",
  "http://giphy.com/gifs/tvnTwvLEm2cKs/fullscreen"
]
/* End of Gif Files */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getStatus(prevStatus, username, apiKey, jenkinsUrl) {
  if (!firstTime) {
    var newJenkinsConnection = "https://" + username + ":" + apiKey + "@" + jenkinsUrl
    jenkins = jenkinsapi.init(newJenkinsConnection, {
      strictSSL: false
    })
  }
  firstTime = true;
  new Promise(function(resolve, reject) {
    jenkins.all_jobs(function(err, data) {
      resolve(data)
    });
  }).then(function(result) {
    displayGif(prevStatus, result)
  }).catch(function(err) {
    if (failedConnection) {} else {
      console.log("We have found an error trying to reference your build:\n", err);
    }
  })
}

function add(a, b) {
    return a + b;
}

function displayGif(prevStatus, result) {
  var myArr = []
  result.forEach(function(element, i) {
    if (element.color === 'aborted') {
      myArr.push(25);
    } else if (element.color === 'blue_anime' || element.color === 'red_anime') {
      myArr.push(150);
    } else if (element.color === 'blue') {
      myArr.push(5);
    } else  {
      myArr.push(-500);
    }
  })
  var currentStatus = prevStatus
  sum = myArr.reduce(add, 0);
  for (i = 0; i < myArr.length; i++) {
    if (sum >= 5 && (sum <= (5 * myArr.length))) {
      status = "success"
    }
    else if (sum >= 25 && (sum <= (25 * myArr.length))) {
      status = "aborted"

    } else if (sum >= 150 && (sum <= (150 * myArr.length))) {
      status = "waiting"

    }  else if (sum < 0) {
      status = "failure"

    }
  }
  if (status === "aborted") {
    if (prevStatus !== 'ABORTED') {
      pkill.full('chrome')
      setTimeout(function() {
        opener(abortedGif[getRandomInt(0,abortedGif.length)])
      }, 1000)
      currentStatus = 'ABORTED'
    }
  } else if (status === "waiting") {
    if (prevStatus !== 'WAITING') {
      pkill.full('chrome')
      setTimeout(function() {
        opener(waitingGif[getRandomInt(0,waitingGif.length)])
      }, 1000)
      currentStatus = 'WAITING'
    }
  } else if (status === "success") {
    if (prevStatus !== 'SUCCESS') {
      pkill.full('chrome')
      setTimeout(function() {
        opener(successGif[getRandomInt(0,successGif.length)])
      }, 1000)
      currentStatus = 'SUCCESS'
    }
  } else {
    if (prevStatus !== 'FAILURE') {
      pkill.full('chrome')
      setTimeout(function() {
        opener(failureGif[getRandomInt(0,failureGif.length)])
      }, 1000)

      currentStatus = 'FAILURE'
    }
  }

  setTimeout(function() {
    getStatus(currentStatus)
  }, 4000)
}

getStatus('', process.env.username, process.env.apikey, process.env.jenkinsurl)
