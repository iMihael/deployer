var NodeGit = require("nodegit");
var fs = require('fs');
var path = require("path");
var lastRepo;

var rmdir = function(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

module.exports = {
    rmdir: rmdir,
    clone: function(cloneUrl, privateKey, publicKey, passphrase, branch, success, error, progress){

        if(!passphrase) {
            passphrase = '';
        }

        //TODO: move to config

        var privateKeyPath = "/tmp/private.key";
        var publicKeyPath = "/tmp/public.key";

        fs.writeFileSync(privateKeyPath, privateKey);
        fs.writeFileSync(publicKeyPath, publicKey);

        var unlinkKeys = function(){
            fs.unlinkSync(privateKeyPath);
            fs.unlinkSync(publicKeyPath);
        };


        var localPath = "/tmp/repo";
        if(fs.existsSync(localPath)) {
            rmdir(localPath);
        }

        var cloneOptions = {
            fetchOpts: {
                callbacks: {
                    certificateCheck: function () {
                        return 1;
                    },
                    credentials: function (url, userName) {
                        return NodeGit.Cred.sshKeyNew(
                            userName,
                            publicKeyPath,
                            privateKeyPath,
                            passphrase
                        );
                    },
                    transferProgress: function(proc){

                        var io = proc.indexedObjects();
                        var to = proc.totalObjects();

                        if(progress) {
                            var percent = io / to * 100;
                            var strPercent = (Math.round(percent * 100) / 100) + " %";
                            progress(strPercent, percent);
                        }
                    }
                }
            },
            checkoutBranch: branch
        };

        NodeGit.Clone(cloneUrl, localPath, cloneOptions).catch(function(err) {
            unlinkKeys();
            error(err);
        }).then(function(repo){
            unlinkKeys();
            lastRepo = repo;
            success(repo, localPath);
        });
    }
};