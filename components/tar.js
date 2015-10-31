var tar = require('tar'),
    fstream = require('fstream'),
    fs = require('fs');

module.exports = {
    packFolder: function(folderPath, archivePath, success, error){

        if(fs.existsSync(archivePath)) {
            fs.unlinkSync(archivePath);
        }

        var dest = fs.createWriteStream(archivePath);
        var packer = tar.Pack({ noProprietary: true })
            .on('error', error)
            .on('end', function(){
                dest.end(success);
            });

        fstream.Reader({
            path: folderPath,
            type: "Directory"
        })
            .on('error', error)
            .pipe(packer)
            .pipe(dest);
    }
};