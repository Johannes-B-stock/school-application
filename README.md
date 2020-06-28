# school-application

This application is a little project that I started to increase my programming skills. I wanted to try out GraphQL and see how I would program a page like this with GraphQL, React, NodeJS and MySQL.

My goal was to create an app for a school or university that provides applications for students. A couple of years ago I created a system like this with CakePHP and Twitter bootstrap. This app is specifically designed to be used by YWAM bases and their schools and is free to be used by anybody under the MIT License.

The Application is currently hosted under heroku for development purposes: [application](http://school-application-development.herokuapp.com/)

## How to get it running locally

To get this running you need to start an additional mysql service and execute the schema.sql script under [server](./server/schema.sql). Note the password, username and database.

follow these steps to get running:

- create a .env file in the server folder and set these 3 variables: `DB_URL`, `HASH_SALT` and `JWT_SECRET` like this: `DB_URL=mysql://username:password@host:port/database`. You can create a hash salt with bcrypt and for the jwt secret just a random string.
- run `yarn install` in the root folder.
- to start the server go to the server folder and run `yarn start` or `yarn start:watch`
- to run the client go to the client folder and run `yarn start`.
- `create-react-app` automatically starts the browser and refreshes when the code changes.

### Contribute to the project

If you want to contribute or want to know more, please message me.
