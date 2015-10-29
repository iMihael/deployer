var lc = require('../db/local_command');

module.exports = {
    create: function(req, res) {
        var local = req.body;
        lc.addLocal(local, req.params.id, function(data){
            res.json(data);
        }, function(){
            res.status(422);
            res.end();
        });
    },
    delete: function(req, res) {
        lc.deleteLocal(req.params.id, req.params.commandId, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        });
    }
};