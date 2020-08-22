# aws-api-serverless-forms
A simple form endpoint using aws lambda, api gateway, dynamoDB and SES.

# Details
I created this to have a lightweight form backend for my personal gridsome site. It's geared towards a very simple form (Name, Email, Message), but could easily be extended.
- It will save the form details in dynamoDB and also send an email through SES to inform you of a new message.
- The serverless framework handles the creation of all the aws rescources.
- The API endpoint is protected with an API Key.

# Setup
To get setup 
1. Verify your sender email in AWS (AWS -> SES -> 'Verify a new email address') and take note of the ARN for this email address.
2. ``cp sample.env .env``
3. Fill out the .env variables
4. ``npm install``
5. ``serverless deploy``
6. The output will include the API endpoint and also the API Key (to be sent as a header x-api-key).
7. Create your form on whatever front end you choose (with 3 fields: Name, Email, Message)
