const fs = require('fs');
module.exports = function deleteGeneratedFiles(mp3Name) {
    const currentPath = __dirname + '/../current.mp4';
    const mp3Path = __dirname + '/../' + mp3Name;
    const mergedSoundPath = __dirname + '/../mergedFile.mp3';
    if (fs.existsSync(currentPath)) {
        fs.unlinkSync(currentPath);
    }
    if (fs.existsSync(mp3Path)) {
        fs.unlinkSync(mp3Path);
    }
    if (fs.existsSync(mergedSoundPath)) {
        fs.unlinkSync(mergedSoundPath);
    }
};