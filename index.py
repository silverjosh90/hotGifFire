import requests
import ssl
import urllib2
import mechanize
import httplib
import socket
import re
import sys, logging
import binascii
import StringIO
import gzip
import webbrowser
import subprocess
import time
from subprocess import Popen
import os


certs = './certs/*.crt'

def connect(self):
    sock = socket.create_connection((self.host, self.port),
    self.timeout, self.source_address)
    if self._tunnel_host:
        self.sock = sock
        self._tunnel()
        self.sock = ssl.wrap_socket(sock, self.key_file, self.cert_file, ssl_version=ssl.PROTOCOL_TLSv1)

httplib.HTTPSConnection.connect = connect




def getGif(currentGif):
    jenkinsLogin = "https://login.cf.nonprod-mpn.ro11.allstate.com/login"
    successUrl = 'https://giphy.com/gifs/win-nXxOjZrbnbRxS/fullscreen'
    failureUrl = 'https://giphy.com/gifs/57WEsxpUr3bTG/fullscreen'
    buildingUrl = 'https://giphy.com/gifs/o5oLImoQgGsKY/fullscreen'
    jenkinsFEUrl = 'https://jenkins-0.cf.nonprod-mpn.ro11.allstate.com/job/IS-Alfred/view/alfred-frontend/'
    jenkinsBEUrl = 'https://jenkins-0.cf.nonprod-mpn.ro11.allstate.com/job/IS-Alfred/view/Alfred-backend-pipeline/'


    browser = mechanize.Browser()
    browser.set_handle_robots(False)

    browser.set_debug_responses(True)


    site= jenkinsFEUrl
    hdr = {'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding' : 'gzip, deflate, sdch, br',
    'Accept-Language':'en-US,en;q=0.8',
    'Connection':'keep-alive',
    'Cookie': 'screenResolution=2560x1440; LOGINIMAGE=bg2; JSESSIONID.154515ab=eeqpondn9ni0r38rx3s68yei; screenResolution=2560x1440',
    'Host':'jenkins-0.cf.nonprod-mpn.ro11.allstate.com',
    'Upgrade-Insecure-Requests':1,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36',
    'Content-type': 'text/html; charset=utf-8'}

    req = urllib2.Request(site, None, hdr)


    browser.open(req)

    response = browser.response()
    response.set_data(response.get_data().replace("<!---", "<!--"))
    browser.set_response(response)

    data = StringIO.StringIO(response.read())

    gzipper = gzip.GzipFile(fileobj=data)
    html = gzipper.read()


    #print html.find('"status":"SUCCESS"')
    if '"status":"FAILURE"' in html:
        if currentGif != 'Failure':
            subprocess.call('pkill firefox', shell=True)
            time.sleep(1)
            currentGif = 'Failure'
            webbrowser.get('firefox').open(failureUrl)

    elif '"status":"SUCCESS"' in html:
        if currentGif != 'Success':
            subprocess.call('pkill firefox', shell=True)
            time.sleep(1)
            webbrowser.get('firefox').open(successUrl)
            currentGif = 'Success'

    elif '"status":"BUILDING"':
        if currentGif != 'Building':
            subprocess.call('pkill firefox', shell=True)
            time.sleep(1)
            webbrowser.get('firefox').open(buildingUrl)
            currentGif = 'Building'

    x = 0
    while x < 1:
        time.sleep(3)
        getGif(currentGif)



getGif('')
