var io;

module.exports = {
    init: function(server){

        io = require('socket.io')(server);

        io.on('connection', function(){
            console.log('socket connected');
        });
    },
    deployLog: function(data) {
        console.log(data);
        io.emit('deploy', data.toString());
    },
    rollbackLog: function(data) {
        io.emit('rollback', data);
    }
};