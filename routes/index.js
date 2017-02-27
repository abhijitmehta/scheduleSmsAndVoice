var path = require('path');
var express = require('express');
var twilio = require('twilio');
var config = require('../config.js');
var http = require('http');
var AccessToken = require('twilio').AccessToken;
var bodyParser = require('body-parser');
var schedule = require('node-schedule');



var twiliAccntInfoFromFile=config.getTwiliAccountSettingsfromFile ;


if (twiliAccntInfoFromFile !="Y" )
   {
     console.log("Loading Configuration from environment");
     // Load configuration information from system environment variables
         TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
         TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ;
         TWILIO_PHONE_NUMBER = process.env.TWILIO_NUMBER;
         TWILIO_IPM_API_KEY = process.env.TWILIO_IPM_API_KEY;
         TWILIO_IPM_API_SECRET = process.env.TWILIO_IPM_API_SECRET;
   }
else
   {
     console.log("Loading Configuration from config.js");
     // Load configuration information config file
         TWILIO_ACCOUNT_SID = config.accountSid;
         TWILIO_AUTH_TOKEN = config.authToken ;
         TWILIO_PHONE_NUMBER = config.phoneNumber;
         TWILIO_IPM_API_KEY = config.apiKey;
         TWILIO_IPM_API_SECRET =  config.apiSecret;
   }

// Configure appplication routes
module.exports = function(app) {

    // Mount Express middleware for serving static content from the "public"
    // directory
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use(express.static(path.join(process.cwd(), 'assets')));
    app.use(bodyParser());
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // In production, validate that inbound requests have in fact originated
    // from Twilio. In our node.js helper library, we provide Express middleware
    // for this purpose. This validation will only be performed in production
    if (config.nodeEnv === 'production') {
        // For all webhook routes prefixed by "/twilio", apply validation
        // middleware
        app.use('/twilio/*', twilio.webhook(config.authToken, {
            host: config.host,
            protocol: 'https' // Assumes you're being safe and using SSL
        }));
    }



/*
 Dummy GET endpoint - ep1?var1=Hello&var2=World
*/
app.get('/ep1', function(i_Req, o_Res)
{
    var var1 = i_Req.query.var1;
    var var2 = i_Req.query.var2;

    console.log ( i_Req.query);
    response=var1 + ":" + var2 ;
    console.log(response);

    //o_Res.set('Content-Type','text/xml');
    //o_Res.send(response.toString());
    o_Res.send(response);

});



/*
 Dummy POST endpoint -ep1?var1=Hello&var2=World
 payload : application/json
         {
	     "var3" : "head",
	     "var4" : "leg"
          }

 Response : Hello:World:head:leg
*/
app.post('/ep1', function(i_Req, o_Res)
{
    var var1 = i_Req.query.var1;
    var var2 = i_Req.query.var2;
    var var3 = i_Req.body.var3;
    var var4 = i_Req.body.var4;

    console.log ( i_Req.query);
    console.log ( i_Req.body);
    response=var1 + ":" + var2 + ":" + var3 + ":" + var4;

    o_Res.set('Content-Type','text/xml');
    o_Res.send(response.toString());

});

app.get('/scheduleSMS' , function(i_Req, o_Res)
{

       //scheduleTime = i_Req.body.scheduleTime ;
       var year  = i_Req.query.year ;
       var month = i_Req.query.month - 1 ;
       var date  = i_Req.query.date;
       var hour = i_Req.query.hour;
       var minute = i_Req.query.minute;
       var second = i_Req.query.second;
       var sendTo = i_Req.query.sendTo ;
       var messageBody = i_Req.query.messageBody ;

       scheduleTime = new Date(year, month, date, hour, minute, second);
       currentTime = new Date().toUTCString() ;

       response = "Current time is " + currentTime +" ; I will send a scheduled sms  at" + scheduleTime  ;
       console.log(response);

       var j = schedule.scheduleJob(scheduleTime, function(curTime,futTime)
       {

               var twilio = require('twilio');
               var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

               //Send an SMS text message
               client.sendMessage(
                 {
                   to:sendTo, // Any number Twilio can deliver to
                   from: 'ABHIJITM', // Alphanumeric sender id in supported country . length 2-11 chars and can include number and letters
                   body: 'You are getting this message from the scheduler . Message was scheduled on  '
                          + curTime
                          + 'for delivery at  '
                          + futTime
                          + '. Here is the actual message  :--> '
                          + messageBody // body of the SMS message
                 }, function(err, responseData)
                            { //this function is executed when a response is received from Twilio
                                 if (!err)
                                    { // "err" is an error received during the request, if any
                                     console.log(responseData.from); // outputs "+441506243869"
                                     console.log(responseData.body); // outputs "Ahoy! from Twilio Helper Library."
                                     console.log(responseData.sid);
                                     console.log(responseData);
                                    }
                                    else
                                    {
                                     console.log(err);
                                    }

                            });




       }.bind(null,currentTime,scheduleTime));

      o_Res.send(response);

});

app.post('/scheduleSMS' , function(i_Req, o_Res)
{

       var year  = i_Req.body.year ;
       var month = i_Req.body.month - 1 ; //month is indexed strting from 0 to 11
       var date  = i_Req.body.date;
       var hour = i_Req.body.hour;
       var minute = i_Req.body.minute;
       var second = i_Req.body.second;
       var sendTo = i_Req.body.sendTo ;
       var messageBody = i_Req.body.messageBody ;
       scheduleTime = new Date(year, month, date, hour, minute, second);
       currentTime = new Date().toUTCString() ;

       response = "Current time is " + currentTime +" ; I will send a scheduled sms  at" + scheduleTime  ;
       console.log(response);

       var j = schedule.scheduleJob(scheduleTime, function(curTime,futTime)
       {

               var twilio = require('twilio');
               var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

               //Send an SMS text message
               client.sendMessage(
                 {
                   to:sendTo, // Any number Twilio can deliver to
                   from: TWILIO_PHONE_NUMBER, // Alphanumeric sender id in supported country . length 2-11 chars and can include number and letters
                   body: 'You are getting this message from the scheduler . Message was scheduled on  '
                          + curTime
                          + 'for delivery at  '
                          + futTime
                          + '. Here is the actual message  :--> '
                          + messageBody // body of the SMS message
                 }, function(err, responseData)
                            { //this function is executed when a response is received from Twilio
                                 if (!err)
                                    { // "err" is an error received during the request, if any
                                     console.log(responseData.from); // outputs "+441506243869"
                                     console.log(responseData.body); // outputs "Ahoy! from Twilio Helper Library."
                                     console.log(responseData.sid);
                                     console.log(responseData);
                                    }
                                    else
                                    {
                                     console.log(err);
                                    }

                            });




       }.bind(null,currentTime,scheduleTime));

      o_Res.send(response);

});


app.post('/scheduleVoiceCall' , function(i_Req, o_Res)
{
       var year  = i_Req.body.year ;
       var month = i_Req.body.month - 1 ; //month is indexed strting from 0 to 11
       var date  = i_Req.body.date;
       var hour = i_Req.body.hour;
       var minute = i_Req.body.minute;
       var second = i_Req.body.second;
       var callTo= i_Req.body.callTo;
       var callUrl= i_Req.body.callUrl;

       /*Add other parameters for /Calls API - ex: statusCallback*/
       scheduleTime = new Date(year, month, date, hour, minute, second);
       currentTime = new Date().toUTCString() ;
       response = "Current time is " + currentTime +" ; I will call out " + callTo +"  at" + scheduleTime  ;
      
       var j = schedule.scheduleJob(scheduleTime, function(curTime,futTime)
       {
               var twilio = require('twilio');
               var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
               //Make an outbound call and use callUrl to perform action when call is connected
              client.calls.create
              ({ 
                  to: callTo, 
                  from: TWILIO_PHONE_NUMBER, 
                  url: callUrl,           
              },
              function(err, call)
              { 
                  console.log(call); 
              }); 
       }.bind(null,currentTime,scheduleTime));
      o_Res.send(response);
});


app.get("/" , function(req,res)
 {
    res.sendFile(__dirname+"/index.html");
 }
);

};
