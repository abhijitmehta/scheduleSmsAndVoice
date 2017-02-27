# Steps 

rename example.config.js to config.js
 
       	mv example.config.js config.js           	
 
Modify the following values in config.js to the values for your Twilio Account

Now start your server with  `nodemon` and you will have your server running on localhost:3000
 
```
nodemon
[nodemon] 1.10.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app.js`
Express server running on port 3000
``` 
 
 
If you do not have nodemon installed, you could install it from npm or use "node app.js" to start the server.
 
That's it . Time to test . Here’s a sample request that you could make to quickly test your schedule

Test the SMS scheduler API 

```
curl -X POST -H "Content-Type: application/json"  -d '{
 "sendTo" : "+44xxxxxxxxxx",
 "messageBody" : "Test Message",
 "year" : "2017",
 "month" : "2",
 "date" : "24",
 "hour" : "22",
 "minute" : "43",
 "second" : "00"
}' "http://localhost:3000/scheduleSMS"
```

Test the Voice scheduler API 


```
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 92f756e2-c1a2-3150-4cac-4d3d85c60435" -d '{
"callTo" : "+44xxxxxxxxxx",
"callUrl" : "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical&amp;Message=please%20wait",
"year" : "2017",
"month" : "2",
"date" : "27",
"hour" : "14",
"minute" : "22",
"second" : "00"
 }' "http://localhost:3000/scheduleVoiceCall"
```
