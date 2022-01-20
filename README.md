# Imageboard

Main folder of the Imageboard application.

You need the Angular cli installed for executing the scripts.

## Development server

Run `npm run start` for prod build and start of backend server.

## Build

Run `npm run build` to build the project(also included in `npm run start`).  
Run `npm run ng:build` to build the angular-client(also included in `npm run start`).  

## MongoDB Initialization

Run `mongod --dbpath data` to start a mongodb process (instead of `data` you can use a user-defined path where you want to store the database).  
Run `mongo` to start the mongo shell.  
Create the database with `use imageboard` in the mongo shell.  