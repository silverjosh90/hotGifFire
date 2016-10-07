var jenkinsapi = require('jenkins-api');
var opener = require('opener')
var pkill = require('pkill')
var jenkins;
var firstTime = false;

function getStatus(prevStatus, username, apiKey, jenkinsUrl) {
  if (!firstTime){
    var newJenkinsConnection = "https://" + username + ":" + apiKey + "@" + jenkinsUrl
      jenkins = jenkinsapi.init(newJenkinsConnection, {strictSSL: false})
  }
  firstTime = true;
    new Promise(function(resolve, reject) {
      jenkins.all_jobs(function(err, data) {
          resolve(data)
      });
    }).then(function(result) {
        displayGif(prevStatus, result)
    }).catch(function(err) {
        if (failedConnection) {}
        else {console.log("We have found an error trying to reference your build:\n",err); }
    })
}

function displayGif(prevStatus, result) {
    var currentStatus = prevStatus
    if (result[0].color === 'blue_anime' || result[1].color === 'blue_anime' || result[0].color === 'red_anime' || result[1].color === 'red_anime') {
        if (prevStatus !== 'WAITING') {
            pkill.full('chrome')
            setTimeout(function() {
                opener('https://giphy.com/gifs/o5oLImoQgGsKY/fullscreen')
            }, 1000)
            currentStatus = 'WAITING'
        }
    } else if (result[0].color === 'blue' && result[1].color === 'blue') {
        if (prevStatus !== 'SUCCESS') {
            pkill.full('chrome')
            setTimeout(function() {
                opener('https://giphy.com/gifs/barney-stinson-neil-patrick-harris-success-vtVpHbnPi9TLa/fullscreen')
            }, 1000)
            currentStatus = 'SUCCESS'
        }
    } else if (result[0].color === 'red' && result[1].color === 'red') {
        if (prevStatus !== 'FAILURE') {
            pkill.full('chrome')
            setTimeout(function() {
                opener('https://giphy.com/gifs/afv-funny-fail-lol-26tP41fh76vmLO3iU/fullscreen')
            }, 1000)

            currentStatus = 'FAILURE'
        }
    } else {
        if (prevStatus !== 'CHRISTMAS') {
            pkill.full('chrome')
            setTimeout(function() {
                opener('https://giphy.com/gifs/christmas-santa-art-K90ckojkohXfW/fullscreen')
            }, 1000)

            currentStatus = 'CHRISTMAS'
        }
    }
    setTimeout(function() {
        getStatus(currentStatus)
    }, 4000)
}

getStatus('', process.env.username, process.env.apikey, process.env.jenkinsurl)
