var io = require('../components/io');
var ssh = require('../components/ssh');
var git = require('../components/git');
var tar = require('../components/tar');

var exec = require('child_process').exec;

//TODO: fix flow movement

var project;
var release;
var flow;
var remote;
var releaseFolderConst = '{RELEASE_FOLDER}';
var releaseFolder;


var replaceRelease = function(str){
    return str.replace(new RegExp(releaseFolderConst, 'g'), releaseFolder);
};

var handleFlow = function(){
    if(flow.length > 0) {
        var step = flow.shift();
        if(step.hasOwnProperty('primary') && step.primary) {
            handlers.primary();
        } else if(step.hasOwnProperty('type')){
            handlers[step.type](step);
        }
    } else {

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
    local_command: function(step){

        var opts = {};
        if(step.dir) {
            opts = {
                cwd: step.dir
            };
        }

        io.deployLog('Executing local "' + step.name + '";');

        exec(step.command, opts, function(error, stdout, stderr){
            if(error) {
                io.deployLog(error);
            }

            if(stdout != "") {
                io.deployLog(stdout);
            }
            if(stderr != "") {
                io.deployLog(stderr);
            }
            io.deployLog('Finished local "' + step.name + '";');

            handleFlow();
        });
    },
    remote_command: function(step){

        io.deployLog('Executing remote "' + step.name + '";');

        var command = replaceRelease(step.command);
        var dir = step.dir ? step.dir : null;

        if(dir) {
            dir = replaceRelease(dir);
        }

        ssh.exec(command, dir, function () {
            io.deployLog('Finished remote "' + step.name + '";');

            handleFlow();
        });


    },
    symlink: function(step){
        io.deployLog('Creating symlink "'+step.title+'";');

        var destination = replaceRelease(step.destination);
        var source = replaceRelease(step.source);

        ssh.exec("rm -rf " + destination + " && ln -s " + source + " " + destination, null, function () {
            io.deployLog('Symlink created;');

            handleFlow();
        });
    },
    upload: function(step){

        io.deployLog('Uploading "' + step.title + '";');

        var destination = replaceRelease(step.destination);
        ssh.upload(step.source, destination, function () {
            io.deployLog('Uploaded;');
            handleFlow();
        }, function(err){
            io.deployLog(err);
        }, function(percent){
            io.deployLog(percent);
        });
    },
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
                ssh.upload(archive, project.remote_path + '/repo.tar', function () {

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

                        //TODO: add releases clear
                        //TODO: add setting for releases count
                        //TODO: remove archive

                    }, function (err) {
                        io.deployLog(err);
                    });


                }, function (err) {
                    io.deployLog(err);
                }, function(percent){
                    io.deployLog(percent);
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
       releaseFolder = project.remote_path + '/releases/' + release;

       flow = project.deployFlow;

       io.deployLog('Starting to deploy;');

       var passphrase = null;
       if(remote.project_keys && project.passphrase) {
           passphrase = project.passphrase;
       } else if(!remote.project_keys && remote.passphrase) {
           passphrase = remote.passphrase;
       }

       ssh.config(
           remote.host,
           remote.port,
           remote.username,
           remote.project_keys ? project.private_key : remote.private_key,
           project.remote_path,
           passphrase
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