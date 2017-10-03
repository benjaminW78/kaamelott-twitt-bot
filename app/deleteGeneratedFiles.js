const fs = require('fs');
module.exports = function deleteGeneratedFiles(mp3Name,randomNumber = '') {
    const currentPath = __dirname + '/../current'+randomNumber+'.mp4';
    const mp3Path = __dirname + '/../' + mp3Name.split('.mp3').join(randomNumber+'.mp3');
    const mergedSoundPath = __dirname + '/../mergedFile'+randomNumber+'.mp3';
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