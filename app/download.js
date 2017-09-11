const cheerio = require('cheerio');
const request = require('request-promise-native');
const random = require('./random.js');
const getTwittText = require('./getTwittText.js');
const cleanName = require('./cleanNames');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const audioconcat = require('audioconcat');
const path = require('path');


async function downloadSong(soundsList) {
    let currentItem;
    let htmlPage = await request('https://github.com/2ec0b4/kaamelott-soundboard/tree/master/sounds').then((data)=> {
        return data;
    });

    const $ = new cheerio.load(htmlPage);
    let songList = $('tr.js-navigation-item>td.content>span>a').toArray();
    // console.log(songList);
    let currentSong = songList[random(songList)];
    // return 'http://kaamelott-soundboard.2ec0b4.fr/#son/' + songList[random(songList)].attribs.title.split('.')[0];
    await request
        .get('https://raw.githubusercontent.com/2ec0b4/kaamelott-soundboard/master/sounds/' + currentSong.attribs.title)
        .pipe(
            fs
                .createWriteStream(__dirname + '/../' + currentSong.attribs.title)
                .on('close', ()=> {
                    console.log(currentSong.attribs.title);
                    currentItem = getTwittText(currentSong.attribs.title, soundsList)
                })
        );
    setTimeout(function () {
        let backgroundName = __dirname + '/../imgs/' + cleanName(currentItem.character) + '.jpg';
        if (!fs.existsSync(backgroundName)) {
            backgroundName = __dirname + '/../imgs/background' + random(undefined, 3) + '.jpg';
        }
        audioconcat([__dirname + '/../sounds/kaamelott-intro.mp3', __dirname + '/../' + currentSong.attribs.title])
            .concat(__dirname + '/../mergedFile.mp3')
            .on('end', async function (output) {
                await ffmpeg()
                    .on('error', (err, stdout, stderr) => {
                            console.log(err.stack);
                            console.log('--- ffmpeg stdout ---');
                            console.log(stdout);
                            console.log('--- ffmpeg stderr ---');
                            console.log(stderr);
                        }
                    )
                    .addOption('-strict', 'experimental')
                    .addInput(backgroundName)
                    .addInput(__dirname + '/../mergedFile.mp3')
                    .withAudioBitrate('64k')
                    .withVideoBitrate('768k')
                    .withSize('640x360')
                    .outputOptions(['-r 1/5', '-vcodec h264', '-pix_fmt yuv420p', '-strict -2', '-acodec aac', '-t 00:05:00'])
                    .output(__dirname + '/../current.mp4')
                    .run();
            })
    }, 5000);
    return currentSong.attribs.title;
}
module.exports = downloadSong;
