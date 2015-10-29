var lc = require('../db/upload');

module.exports = {
    create: function(req, res) {
        var upload = req.body;
        lc.addUpload(upload, req.params.id, function(data){
            res.json(data);
        }, function(){
            res.status(422);
            res.end();
        });
    },
    delete: function(req, res) {
        lc.deleteUpload(req.params.id, req.params.uploadId, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        });
    }
};