# easyAdopt <br>
[Visit website](http://easyadopt.s3-website-us-west-2.amazonaws.com/)

![Website Image](https://i.ibb.co/rZPVcRw/homepage.png)

CMPE172 Project

Team #9 Members: <br>
Yazan Arafeh <br>
Kevin Pham <br>

Professor Babu Thomas
San Jose State University

What is easyAdopt?
  - Web application that allows users to view animals available for adoption. Users can add a category of animals (cat, dog, reptile, etc...) and create flashcards within each category. A flashcard contains a name on one side and descriptions on the other side.
  
Logistics 
  - AWS S3 - Hold our static resources for the web applications (HTML, CSS, JavaScript) <br>
  - AWS Cognito - Manages user pool and user accounts (Authentication)
  - AWS DynamoDB - Database
  - HTML/CSS/JavaScript
  - ![System Diagram](https://i.ibb.co/6YwN9hw/dia.png)
  
 Basic Setup
  - easyAdopt is currently hosted and running using Amazon S3. No setup is required to run and view the web application. The web application is currently running using a personal AWS account with private credentials. To replicate the web application, clone the latest version off from GitHub, and make changes. 
  
 Amazon's S3
  - To host on S3, upload all the static content (HTML, JS, CSS, etc…) and enable the endpoint provided by Amazon’s S3
  - ![S3 Hosting](https://i.ibb.co/4ps2jjV/s3.png)
  
 Amazon's DynamoDB
  - To set up DynamoDB, create two tables. Name the first table ‘topics’ and the second called ‘flashcards’. The ‘topics’ table will have the attribute ‘name’. While the ‘flashcards’ table will have attributes ‘front’, ‘back’, ‘topic’, and ‘createdAt’. 
  - ![DynamoDB](https://i.ibb.co/0qTjxG6/dynamo.png)
  
  Amazon's Cognito
  - Change the credentials in the config.js to reflect your own AWS account. This includes the user pool IDs and region.
  - ![Cognito](https://i.ibb.co/pQd8hC4/config.png)

   
Help & Guidance 
  - "Build a Serverless Web Application with AWS Lambda, Amazon API Gateway, Amazon S3, Amazon DynamoDB, and Amazon Cognito" <br>
        - https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/ <br>
  - "DynamoDB: Exercise 3.1: Get/Add Items to DynamoDB Tables" <br>
        - https://medium.com/@KerrySheldon/dynamodb-exercise-3-1-get-add-items-to-dynamodb-tables-11e5f369509d <br>
