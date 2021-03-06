const cheerio = require('cheerio');
const request = require('request-promise-native');
const random = require('./random.js');
const getTwittText = require('./getTwittText.js');
const fs = require('fs');
const Q = require('q');


async function downloadSong(soundsList, randomNumber = '') {
    let currentItem;
    let htmlPage = await request('https://github.com/2ec0b4/kaamelott-soundboard/tree/master/sounds').then((data)=> {
        return data;
    });

    const $ = new cheerio.load(htmlPage);
    let songList = $('div.js-navigation-item>div[role="rowheader"]>span>a').toArray();
    let currentSong = songList[random(songList)];
    let firstDeferred = new Q.defer();
    // return 'http://kaamelott-soundboard.2ec0b4.fr/#son/' + songList[random(songList)].attribs.title.split('.')[0];
    console.log(currentSong.attribs.title);
    request
        .get('https://raw.githubusercontent.com/2ec0b4/kaamelott-soundboard/master/sounds/' + currentSong.attribs.title)
        .pipe(
            fs
                .createWriteStream(__dirname + '/../' + currentSong.attribs.title.split('.mp3').join(randomNumber + '.mp3'))
                .on('close', ()=> {

                    console.log('downloaded song name: ' + currentSong.attribs.title);
                    currentItem = getTwittText(currentSong.attribs.title, soundsList);

                    if (!currentItem) {
                        firstDeferred.reject(false);
                    } else {
                        firstDeferred.resolve(currentSong.attribs.title);
                    }
                }).on('error', ()=> {
                firstDeferred.reject(false);
            })
        );

    await firstDeferred.promise;

    return currentSong.attribs.title;

}
module.exports = downloadSong;
