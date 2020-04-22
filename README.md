In app.service.ts add your AWS S3 credentials for testing.
Run `npm install`, then `npm:start` command. Project is working now.
POST `localhost:3000/login` with fields username and password in body to get JWT token. Admin: 12345678 or User: password.
With that token you can POST `localhost:3000/upload`. Upload image in body and in headers use 
your JWT token - Authorization: Bearer + token. 
After that just send request and you'll recieve response with 3 link for each of images uploaded.
