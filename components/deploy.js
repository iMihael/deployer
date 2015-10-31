var io = require('../components/io');
var ssh = require('../components/ssh');
var git = require('../components/git');
var tar = require('../components/tar');

module.exports = {
   deploy: function(project, remote){

       var ts = Math.floor(Date.now() / 1000);

       io.deployLog('Starting to deploy;');

       ssh.config(
           remote.host,
           remote.port,
           remote.username,
           remote.project_keys ? project.private_key : remote.private_key,
           project.remote_path
       );

       ssh.onError = function(err) {
           io.deployLog(err);
       };

       for(var i in project.deployFlow) {
           if(project.deployFlow[i].primary) {

               io.deployLog('Cloning project;');
               git.clone(project.git_remote, project.private_key, project.public_key, project.passphrase, remote.branch, function(repo, path){
                   io.deployLog('Project cloned;');

                   io.deployLog('Creating archive;');
                   var archive = path + '.tar';
                   tar.packFolder(path, archive, function(){

                       io.deployLog('Archive created;');
                       git.rmdir(path);

                       io.deployLog('Uploading archive;');
                       ssh.upload(archive, project.remote_path, function(){


                           io.deployLog('Archive uploaded;');

                           ssh.onReady = function(){
                               io.deployLog('Extracting archive;');
                               ssh.exec('rm repo -rf && tar -xf repo.tar', project.remote_path, function(){

                                   io.deployLog('Archive extracted;');

                                   io.deployLog('Creating release;');

                                   ssh.exec('mv repo releases/' + ts, project.remote_path, function(){
                                       io.deployLog('Release '+ts+' created;');
                                   }, function(err){
                                       io.deployLog(err);
                                   });

                                   //TODO: add symlink on finish
                                   //TODO: add releases clear
                                   //TODO: add setting for releases count

                               }, function(err){
                                   io.deployLog(err);
                               });
                           };

                           ssh.connect();

                       }, function(err){
                           io.deployLog(err);
                       });

                   }, function(err){
                       console.log(err);
                   });

               }, function(err){
                   io.deployLog(err);
               });
           }
       }


   },
   rollback: function(project){

   }
};