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
  console.log("result", result);
  result.forEach(function(element, i) {
    console.log("element", element);
    if (element.color === 'aborted') {
      myArr.push(25);
    } else if (element.color === 'blue_anime' || element.color === 'red_anime') {
      myArr.push(150);
    } else if (element.color === 'blue') {
      myArr.push(5);
    } else  {
      myArr.push(-1000);
    }
  })
  console.log(myArr);
  var currentStatus = prevStatus
  sum = myArr.reduce(add, 0);
  console.log("sum", sum);
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
  console.log();
  if (status === "aborted") {
    if (prevStatus !== 'ABORTED') {
      pkill.full('chrome')
      setTimeout(function() {
        opener('http://giphy.com/gifs/idk-shrug-power-rangers-y65VoOlimZaus/fullscreen')
      }, 1000)
      currentStatus = 'ABORTED'
    }
  } else if (status === "waiting") {
    if (prevStatus !== 'WAITING') {
      pkill.full('chrome')
      setTimeout(function() {
        opener('http://giphy.com/gifs/26gsvogX9m2Lk7twA/fullscreen')
      }, 1000)
      currentStatus = 'WAITING'
    }
  } else if (status === "success") {
    if (prevStatus !== 'SUCCESS') {

      pkill.full('chrome')
      setTimeout(function() {
        opener('http://giphy.com/gifs/green-ranger-walking-l3q2TF4pshyJVjVMA/fullscreen')
      }, 1000)
      currentStatus = 'SUCCESS'
    }
  } else {
    if (prevStatus !== 'FAILURE') {
      pkill.full('chrome')
      setTimeout(function() {
        opener('http://giphy.com/gifs/red-ranger-drink-fail-l3q2PoTK6ZbyoqP6g/fullscreen')
      }, 1000)

      currentStatus = 'FAILURE'
    }
  }

  setTimeout(function() {
    getStatus(currentStatus)
  }, 4000)
}

getStatus('', process.env.username, process.env.apikey, process.env.jenkinsurl)
