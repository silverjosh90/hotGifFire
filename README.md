# hotGifFire

A simple node app that will connect to your Jenkins project using your username and API key. The app then opens a browser window displaying a giphy representing the current build status.

# To Run via Command-line:
Type this into your command line and put in your information for the username, api key, and jenkins url.

```
username=<username> apikey=<api_key_for_jenkins> jenkinsurl=<url_for_jenkins_project> node nodeGifFire.js
```

# How do I find my Jenkins API Key?
* Log into Jenkins
* Click on your username in the top right corner of the page
* Click on 'Configure'
* Copy your API Token

# Which url do I use for the 'Jenkins Url'?
The Url should be the domain name and path to your project folder on Jenkins, excluding the protocol (https://).
* Example: 
```
jenkins-0.cf.nonprod-mpn.ro11.allstate.com/job/IS-Alfred/
```
