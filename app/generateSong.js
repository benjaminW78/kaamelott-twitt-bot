const Q = require('q');
const audioconcat = require('audioconcat');
const cleanName = require('./cleanNames');
const fs = require('fs');
const getTwittText = require('./getTwittText');
const ffmpeg = require('fluent-ffmpeg');
const random = require('./random');

function generateSong(currentSong, soundsList) {
    let currentItem = getTwittText(currentSong, soundsList);
    let secondDeferred = new Q.defer();

    let backgroundName = __dirname + '/../imgs/' + cleanName(currentItem.character) + '.jpg';

    if (!fs.existsSync(backgroundName)) {
        backgroundName = __dirname + '/../imgs/background' + random(undefined, 3) + '.jpg';
    }

    audioconcat([__dirname + '/../sounds/kaamelott-intro.mp3', __dirname + '/../' + currentSong])
        .concat(__dirname + '/../mergedFile.mp3')
        .on('end', function (output) {
            ffmpeg()
                .on('error', (err, stdout, stderr) => {
                    console.log(err.stack);
                    console.log('--- ffmpeg stdout ---');
                    console.log(stdout);
                    console.log('--- ffmpeg stderr ---');
                    console.log(stderr);
                    secondDeferred.reject(false);
                })
                .on('end', (err, stdout, stderr) => {
                    console.log('--- ffmpeg end generation ---');
                    secondDeferred.resolve(currentSong);
                })
                .addOption('-strict', 'experimental')
                .addInput(backgroundName)
                .addInput(__dirname + '/../mergedFile.mp3')
                .withAudioBitrate('64k')
                .withVideoBitrate('768k')
                .withSize('640x360')
                .outputOptions(['-r 1/5', '-vcodec h264', '-pix_fmt yuv420p', '-strict -2', '-acodec aac', '-t 00:05:00'])
                .output(__dirname + '/../current.mp4')
                .run();
        });

    console.log('pouet', currentSong);
    return secondDeferred.promise;
}
module.exports = generateSong;