var scpClient = require('scp2');
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
    });

    module.exports.onReady();
});



module.exports = {
    config: function(host, port, username, privateKey, projectPath){
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
    },
    exec: function(cmd, pwd, success, error, reader) {
        conn.shell(function(err, stream) {

            if (err) {
                error(err);
            }

            if(reader) {
                reader(stream);
            }

            stream.end('cd '+pwd+';\n'+cmd+';\nexit;\n');
            success();
        });

    },
    upload: function(sourcePath, dstPath, success, error) {

        config.path = dstPath;

        scpClient.scp(sourcePath, config, function(err){
            if(!err) {
                success();
            } else {
                error();
            }
        })
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