var io = require('../components/io');
var ssh = require('../components/ssh');
var git = require('../components/git');
var tar = require('../components/tar');
var fs = require('fs');

var exec = require('child_process').exec;

var project;
var release;
var flowType;
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
        if(step.hasOwnProperty('primary') && step.primary && flowType == 'deploy') {
            handlers.primaryDeploy();
        } else if(step.hasOwnProperty('primary') && step.primary && flowType == 'rollback'){
            handlers.primaryRollback();
        }
        else if(step.hasOwnProperty('type')){
            handlers[step.type](step);
        }
    } else {


        io.deployLog("Removing old releases;");
        ssh.clearReleases(function(){

            io.deployLog("Creating symlink to current release;");



            ssh.exec('rm -rf current && ln -s releases/' + release + " current", project.remote_path, function () {

                ssh.disconnect();

                io.deployLog("Flow finished.");
            }, function(err) {
                if(err) {
                    io.deployLog(err);
                }
            });

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
    primaryRollback: function(){
        io.deployLog('Going to previous release "'+ release +'";');
        handleFlow();
        //ssh.toPrevRelease();
    },
    primaryDeploy: function(){
        io.deployLog('Cloning project;');

        var publicKey, privateKey;

        if(project.hasOwnProperty('systemKeys') && project.systemKeys) {
            var home = process.env.HOME;
            privateKey = fs.readFileSync(home + '/.ssh/id_rsa');
            publicKey = fs.readFileSync(home + '/.ssh/id_rsa.pub');
        } else {
            privateKey = project.private_key;
            publicKey = project.public_key;
        }

        git.clone(project.git_remote, privateKey, publicKey, project.passphrase, remote.branch, function (repo, path) {
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

                        //TODO: add setting for releases count

                    }, function (err) {
                        io.deployLog(err);
                    });


                }, function (err) {
                    io.deployLog(err);
                }, function(percent){
                    io.deployLog(percent);
                });

            }, function (err) {
                io.deployLog(err);
            });

        }, function (err) {
            io.deployLog(err);
        }, function(percent){
            io.deployLog(percent);
        });
    }
};

var sshConnect = function(project, remote, success){
    var passphrase = null;
    if(remote.project_keys && project.passphrase) {
        passphrase = project.passphrase;
    } else if(!remote.project_keys && remote.passphrase) {
        passphrase = remote.passphrase;
    }

    var privateKey;

    if(remote.project_keys && project.hasOwnProperty('systemKeys') && project.systemKeys) {
        var home = process.env.HOME;
        var keyPath = home + '/.ssh/id_rsa';
        privateKey = fs.readFileSync(keyPath);
        //get system key
    } else if(remote.project_keys && project.private_key) {
        privateKey = project.private_key;
    } else {
        privateKey = remote.private_key;
    }

    ssh.config(
        remote.host,
        remote.port,
        remote.username,
        privateKey,
        project.remote_path,
        passphrase
    );

    ssh.onError = function(err) {
        io.deployLog(err);
    };

    ssh.connect();

    ssh.onReady = function() {
        success();
    }
};

module.exports = {
   deploy: function(_project, _remote){

       flowType = 'deploy';
       remote = _remote;
       project = _project;

       release = Math.floor(Date.now() / 1000);
       releaseFolder = project.remote_path + '/releases/' + release;

       flow = project.deployFlow;

       io.deployLog('Starting to deploy;');

       sshConnect(project, remote, function(){
           handleFlow();
       });

   },
   rollback: function(_project, _remote){

       flowType = 'rollback';
       remote = _remote;
       project = _project;

       flow = project.rollbackFlow;

       io.deployLog('Starting to rollback;');

       sshConnect(project, remote, function(){
           ssh.getPrevReleaseFolder(function(_release){
               release = _release;
               handleFlow();
           });
       });
   }
};