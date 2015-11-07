var io = require('../components/io');
var ssh = require('../components/ssh');
var git = require('../components/git');
var tar = require('../components/tar');

var project;
var release;
var flow;
var remote;

var handleFlow = function(){
    if(flow.length > 0) {
        var step = flow.pop();
        if(step.hasOwnProperty('primary') && step.primary) {
            handlers.primary();
        } else if(step.hasOwnProperty('type')){
            handlers[step.type]();
        }
    } else {
        //TODO: implement finish

        ssh.exec('rm -rf current && ln -s releases/' + release + " current", project.remote_path, function () {
            io.deployLog("Flow finished.");
        }, function(err) {
            if(err) {
                io.deployLog(err);
            }
        });

    }

};

var handlers = {
    local_command: function(){},
    remote_command: function(){},
    symlink: function(){},
    upload: function(){},
    primary: function(){
        io.deployLog('Cloning project;');
        git.clone(project.git_remote, project.private_key, project.public_key, project.passphrase, remote.branch, function (repo, path) {
            io.deployLog('Project cloned;');

            io.deployLog('Creating archive;');
            var archive = path + '.tar';
            tar.packFolder(path, archive, function () {

                io.deployLog('Archive created;');
                git.rmdir(path);

                io.deployLog('Uploading archive;');
                ssh.upload(archive, project.remote_path, function () {

                    io.deployLog('Archive uploaded;');


                    io.deployLog('Extracting archive;');
                    ssh.exec('rm repo -rf && tar -xf repo.tar', project.remote_path, function () {

                        io.deployLog('Archive extracted;');

                        io.deployLog('Creating release;');

                        ssh.exec('mv repo releases/' + release + " && rm repo.tar", project.remote_path, function () {
                            io.deployLog('Release ' + release + ' created;');

                            handleFlow();

                        }, function (err) {
                            io.deployLog(err);
                        });

                        //TODO: add symlink on finish
                        //TODO: add releases clear
                        //TODO: add setting for releases count
                        //TODO: remove archive

                    }, function (err) {
                        io.deployLog(err);
                    });
                    //};

                    //ssh.connect();

                }, function (err) {
                    io.deployLog(err);
                });

            }, function (err) {
                console.log(err);
            });

        }, function (err) {
            io.deployLog(err);
        });
    }
};

module.exports = {
   deploy: function(_project, _remote){

       remote = _remote;
       project = _project;
       release = Math.floor(Date.now() / 1000);
       flow = project.deployFlow;

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

       ssh.connect();

       ssh.onReady = function() {
           handleFlow();
       }

   },
   rollback: function(project){

   }
};