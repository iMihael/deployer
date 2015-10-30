var io = require('../components/io');
var ssh = require('../components/ssh');

module.exports = {
   deploy: function(project){
       io.deployLog('Starting to deploy;');

       ssh.onReady = function(){
           io.deployLog('Connected to remote server;');

           for(var i in project.deployFlow) {
               if(project.deployFlow[i].primary) {
                   //TODO: implement deployment
               }
           }

           //ssh.disconnect();
       };

       ssh.connect(
           project.remotes[0].host,
           project.remotes[0].port,
           project.remotes[0].username,
           project.remotes[0].project_keys ? project.private_key : project.remotes[0].private_key
       );
   },
   rollback: function(project){

   }
};