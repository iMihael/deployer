# Deployer
Inspired by [capistrano](http://capistranorb.com/)

This is web based deployment tool writen with nodejs and angularjs.  
It works only on linux (maybe mac and other unix based OS too).  
Deployment going only via git (ssh, not https) and sftp.  
You must have ssh access to deployment server to use this app.  

Instalation process
======================
- Install and run mongodb server, and config it in config.json  
- Install npm and bower globally
- Clone this git repository
- run `npm install`
- cd public/js and run `bower install`
- cd to project root and run `npm start`
