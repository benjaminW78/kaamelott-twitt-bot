const fs = require('fs');
module.exports = function deleteGeneratedFiles(mp3Name) {
    fs.unlinkSync(__dirname + '/../current.mp4');
    fs.unlinkSync(__dirname + '/../' + mp3Name);
    fs.unlinkSync(__dirname + '/../mergedFile.mp3');
};