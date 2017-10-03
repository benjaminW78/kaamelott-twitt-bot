const Q = require('q');
const audioconcat = require('audioconcat');
const cleanName = require('./cleanNames');
const fs = require('fs');
const getTwittText = require('./getTwittText');
const ffmpeg = require('fluent-ffmpeg');
const random = require('./random');

function generateSong(currentSong, soundsList, isSlack = false) {
    let currentItem = getTwittText(currentSong, soundsList);
    let secondDeferred = new Q.defer();
    let mergedSongPath;
    let videoPath;
    let randomNumber;
    const introSongPath = __dirname + '/../sounds/kaamelott-intro.mp3';
    const currentSongPath = __dirname + '/../' + currentSong;

    if (isSlack) {
        randomNumber = random(undefined, 100000);
        mergedSongPath = __dirname + '/../mergedFile' + randomNumber + '.mp3';
        videoPath = __dirname + '/../current' + randomNumber + '.mp4';
    } else {
        mergedSongPath = __dirname + '/../mergedFile.mp3';
        videoPath = __dirname + '/../current.mp4';
    }

    let backgroundName = __dirname + '/../imgs/' + cleanName(currentItem.character) + '.jpg';

    if (!fs.existsSync(backgroundName)) {
        backgroundName = __dirname + '/../imgs/background' + random(undefined, 3) + '.jpg';
    }

    audioconcat([introSongPath, currentSongPath])
        .concat(mergedSongPath)
        .on('end', function (output) {
            ffmpeg()
                .on('error', (err, stdout, stderr) => {
                    console.log(err.stack);
                    console.log('--- ffmpeg stdout ---');
                    console.log(stdout);
                    console.log('--- ffmpeg stderr ---');
                    console.log(stderr);
                    console.log('\n');
                    secondDeferred.reject(false);
                })
                .on('end', (err, stdout, stderr) => {
                    console.log('--- ffmpeg end generation ---');
                    console.log('\n');
                    if (isSlack) {
                        secondDeferred.resolve([videoPath, randomNumber]);
                    } else {
                        secondDeferred.resolve(currentSong);
                    }
                }).on('start', (err, stdout, stderr) => {
                console.log('--- ffmpeg start generation ---');
                console.log('\n');
            })
                .addOption('-strict', 'experimental')
                .addInput(backgroundName)
                .addInput(mergedSongPath)
                .withAudioBitrate('64k')
                .withVideoBitrate('768k')
                .withSize('640x360')
                .outputOptions(['-r 1/5', '-vcodec h264', '-pix_fmt yuv420p', '-strict -2', '-acodec aac', '-t 00:05:00'])
                .output(videoPath)
                .run();
        });
    return secondDeferred.promise;
}
module.exports = generateSong;