# AmazonEcho---StockMarketAgent
Amazon Echo demo application for stock market assitance

Step for POC : 

Step 1 Setting up Alex skill set.

1) Create Account on https://developer.amazon.com/edw/home.html.

2) Click on tab ALEXA.

3) Click on Alexa Skills Kit and Create new skill.

4) Once skill is created set Skill Information.

5) After this goto Interaction Model and copy past schema from "Intent Schema.txt" to Intent Schema text box.

6) Repeat same steps for Sample Utterances. Copy past utterances from "Sample Utterances.txt" to Sample Utterances text box.

7) Save your changes.

8) Next step is to configure your Lambda endpoints with ALEXA.

9) We have to copy ARN from your lambda function and paste it in config section.

10) Now you can test you model.

Step 2 Creating Lambda function:

1) Logging to your AWS account "https://console.aws.amazon.com/console/home".

2) Goto dashboard and click on Lambda

3) Now click on Create New Lambda Function.

4) After this we have to select blue print for your lambda function.

5) This staep is optional if you are buginner then you can select one of the existing blue print for your referance else you can skip this step.

6) After this we have to give function name set it to "StockMarketAgent" and select run time as Node.js 4.3.

7) Keep everything as is and save your function.s

8) After this just copy past code from "StockMarketAgent.js" to editor and save changes.
