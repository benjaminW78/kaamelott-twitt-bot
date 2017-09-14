const twit = require('twit');
const config = require('../config.js');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const http = require('http');
const download = require('./download');
const deleteGeneratedFiles = require('./deleteGeneratedFiles');
const getTwittText = require('./getTwittText');
const getSoundsList = require('./getSoundsJson');

if (process.env['consumer_key']) {
    config.consumer_key = process.env['consumer_key'];
    config.consumer_secret = process.env['consumer_secret'];
    config.access_token = process.env['access_token'];
    config.access_token_secret = process.env['access_token_secret'];
    config.trigger_hours = process.env['trigger_hours'];
}

console.log('current config: ', config);

const twittBot = new twit(config);

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

function postTweetWithMediaText() {
    let filePath = __dirname + '/../current.mp4';

    twittBot.postMediaChunked({file_path: filePath}, async function (err, data, response) {
        twittBot.post('statuses/update', {
            status: getTwittText(mp3Name, soundsList).twitt,
            media_ids: [data.media_id_string]
        }).then(function (resp) {
            console.log(resp.data.text);
            console.log('tweet created at:', (moment(resp.data.created_at, 'ddd MMM DD HH:mm:ss +Z YYYY').format('DD-MM-YYYY HH:mm')));
            deleteGeneratedFiles(mp3Name);
        });
    });
}
async function doDownload() {
    soundsList = await getSoundsList();

    let data = await download(soundsList);
    mp3Name = data;

    let request = await twittBot.get('statuses/user_timeline');
    let twittsText = request.data.map(function (current) {
        return current.text.split(' https://')[0]
    });

    console.log((getTwittText(mp3Name, soundsList).twitt));
    if (-1 !== twittsText.indexOf(getTwittText(mp3Name, soundsList).twitt)) {
        deleteGeneratedFiles(mp3Name);
        doDownload();
        console.log('DO DOWNLOAD AGAIN! because duplicate tweet: ' + getTwittText(mp3Name, soundsList).twitt);
    } else {
        setTimeout(postTweetWithMediaText, 20000);
    }
    return true;
}
