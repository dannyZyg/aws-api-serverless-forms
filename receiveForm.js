'use strict';

const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'ap-southeast-2'});

module.exports.handler = (event, context, callback) => {

  if (event.body != null) {
    var form = JSON.parse(event.body);
    sendEmail(form, event, callback);
  }
  else {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error',
        error: 'No valid body in request.',
        event: event,
      })
    })
  }
};

const createDynamoFormSubmission = (form, event, callback) => {

  // Create the DynamoDB service object
  var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const uuid = uuidv4();
  const utcDate = new Date().getTime()
  var dateHumanReadable = new Date(utcDate);
  var params = {
    TableName: 'dzk-api-form-submissions',
    Item: {
      FormId : {S: uuid},
      Name : {S: form.name},
      Message : {S: form.message},
      Email : {S: form.email},
      DateTimeReceived : {S: dateHumanReadable.toString()}
    },
  };

  // Call DynamoDB to add the item to the table
  const dbPromise = ddb.putItem(params).promise();
  dbPromise
    .then(data => {
      console.log('Success', data);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Success',
          event: event,
          data: data
        })
      })
    })
    .catch(function(err) {
      console.error(err);
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Error',
          event: event,
          error: err,
        })
      })
    });
}

const sendEmail = (form, event, callback) => {
  var params = {
    Destination: {
       ToAddresses: [
         process.env.EMAIL_RECIPIENT
       ]
      }, 
    Message: {
     Body: {
       Html: {
       Charset: "UTF-8", 
         Data: constructBodyHtml(form)
      }, 
      Text: {
       Charset: "UTF-8", 
       Data: constructBodyText(form)
      }
     },
     Subject: {
      Charset: "UTF-8", 
      Data: `AWS SES - New message from ${process.env.SITE_NAME}`
      }
    },  
    Source: process.env.EMAIL_SENDER,
     Tags: [
       {
         Name: 'source', /* required */
         Value: 'AWS' /* required */
       },
     ]
   };

  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  sendPromise.then(
    function(data) {
      console.log('Sent email - MessageId: ', data.MessageId);
      createDynamoFormSubmission(form, event, callback);
    }).catch(
      function(err) {
      console.error(err, err.stack);
      createDynamoFormSubmission(form, event, callback);
    });
}

const constructBodyText = (form) => {
  let bodyText = `Name: ${form.name}\n`
  bodyText += `Email: ${form.email}\n`
  bodyText += `Message: ${form.message}\n`
  return bodyText
}

const constructBodyHtml = (form) => {
  let bodyHtml = `<h3>Name: ${form.name}</h3><br>`
  bodyHtml += `<h3>Email: ${form.email}</h3><br>`
  bodyHtml += `<p>Message: ${form.message}</p>`
  return bodyHtml
}
