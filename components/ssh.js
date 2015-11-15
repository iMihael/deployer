var config = {};

var Client = require('ssh2').Client;
var conn = new Client();

var _sftp;

conn.on('error', function(err){
    module.exports.onError(err);
});

conn.on('ready', function() {

    conn.sftp(function(err, sftp) {
        if (err) throw err;
        _sftp = sftp;

        if(config.hasOwnProperty('projectPath')) {
            sftp.readdir(config.projectPath, function(err, list) {
                var create = true;
                for(var i in list) {
                    if(list[i].filename == 'releases') {
                        create = false;
                    }
                }

                if(create) {
                    sftp.mkdir(config.projectPath + '/releases');
                }
            });
        }

        module.exports.onReady();
    });


});


var names = [];
var removeName = function(success){
    if(names.length > 5) {
        var dir = names.shift();
        conn.exec("rm -rf " + config.projectPath + '/releases/' + dir, function(){
            removeName(success);
        });
    } else {
        success();
    }
};

module.exports = {
    getPrevReleaseFolder: function(success){
        _sftp.readdir(config.projectPath + '/releases', function(err, list) {
            names = [];
            for (var i in list) {
                names.push(list[i].filename);
            }
            names = names.sort().reverse();
            success(names[1]);
        });
    },
    clearReleases: function(success){
        _sftp.readdir(config.projectPath + '/releases', function(err, list) {
            names = [];
            for(var i in list) {
                names.push(list[i].filename);
            }
            names = names.sort();
            removeName(success);
        });
    },
    config: function(host, port, username, privateKey, projectPath, passphrase){
        config = {
            host: host,
            port: port,
            username: username,
            privateKey: privateKey,
            projectPath: projectPath,
            debug: function(str){
                //console.log(str);
            }
        };

        if(passphrase) {
            config['passphrase'] = passphrase;
        }
    },
    exec: function(cmd, pwd, success, error, reader) {
        conn.shell(function(err, stream) {

            if (err) {
                error(err);
            }

            if(reader) {
                reader(stream);
            }

            stream.on('close', function(code, signal) {
                success();
            });

            if(pwd) {
                stream.end('cd ' + pwd + ';\n' + cmd + ';\nexit;\n');
            } else {
                stream.end(cmd + ';\nexit;\n');
            }



            //success();
        });

    },
    upload: function(sourcePath, dstPath, success, error, status) {

        _sftp.fastPut(sourcePath, dstPath, {
            chunkSize: 32768,
            step: function(total_transferred, chunk, total){
                if(status) {
                    var percent = total_transferred / total * 100;
                    var strPercent = (Math.round(percent * 100) / 100) + " %";
                    status(strPercent, percent);
                }
            }
        }, function(err){
            if(!err) {
                success();
            } else {
                error(err);
            }
        });

    },
    onError: function(){

    },
    onReady: function(){

    },
    connect: function(){
        conn.connect(config);
    },
    disconnect: function(){
        conn.end();
    }
};