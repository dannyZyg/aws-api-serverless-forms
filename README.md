# aws-api-serverless-forms
A simple form endpoint using aws dynamoDB and SES.

# Setup
To get setup 
1. ``cp sample.env .env``
2. Fill out the .env variables
3. Verify your sender email in AWS (AWS -> SES -> 'Verify a new email address')
4. ``npm install``
5. ``serverless deploy``
6. The output will include the API endpoint and also the API Key (to be sent as a header x-api-key).
7. Create your form on whatever front end you choose (with 3 fields: Name, Email, Message)
