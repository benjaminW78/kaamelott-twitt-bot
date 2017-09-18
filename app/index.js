const fs = require('fs');
const moment = require('moment');
const path = require('path');
const http = require('http');
const download = require('./download');
const deleteGeneratedFiles = require('./deleteGeneratedFiles');
const getTwittText = require('./getTwittText');
const getSoundsList = require('./getSoundsJson');
const postTweetWithMediaText = require('./postTweetWithMedia');
const generateSong = require('./generateSong');
const twittBot = require('./twittBot');

const express = require('express');
const app = express();

app.get('/new', function (req, res) {
    doDownload();
    res.send('200', 'new twitt send');
});

app.listen(8080, function () {
    console.log('kaamelott-twitt-bot app listening on port 8080!')
});

let mp3Name;
let lastTrigger;
let soundsList;

function runTime() {

    let temp = moment().utcOffset('+0200').format('HH:mm');
    if (-1 !== config.trigger_hours.indexOf(temp) && lastTrigger != temp) {
        lastTrigger = temp;
        doDownload();
    }
    setTimeout(runTime, 60000);
}


runTime();


async function doDownload() {
    soundsList = await getSoundsList();

    let data = await download(soundsList);
    mp3Name = data;
    if (data) {
        let request = await twittBot.get('statuses/user_timeline');
        let twittsText = request.data.map(function (current) {
            return current.text.split(' https://')[0]
        });
        let currentTwittText = getTwittText(mp3Name, soundsList);
        console.log(currentTwittText.twitt);

        if (-1 !== twittsText.indexOf(currentTwittText.twitt)) {
            deleteGeneratedFiles(mp3Name);
            doDownload();
            console.log('DO DOWNLOAD AGAIN! because duplicate tweet: ' + currentTwittText.twitt);
            return false;
        } else {
            let resultgenerateSong = await generateSong(mp3Name, soundsList);
            await postTweetWithMediaText(resultgenerateSong, soundsList);
            deleteGeneratedFiles(mp3Name);
            return true;
        }
    } else {
        doDownload();
    }
}
