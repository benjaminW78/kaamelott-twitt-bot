const twit = require('twit');
const config = require('../config.js');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
if (!config.consumer_key) {
    config.consumer_key = process.env['consumer_key'];
    config.consumer_secret = process.env['consumer_secret'];
    config.access_token = process.env['access_token'];
    config.access_token_secret = process.env['access_token_secret'];
}

const twittBot = new twit(config);

const download = require('./download');
// Load the http module to create an http server.
const http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
const server = http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("tweettBot running\n");
});

let mp3Name;
let lastTrigger;

function runTime() {
    let temp = moment().format('HH:mm');
    if (-1 !== config.trigger_hours.indexOf(temp) && lastTrigger != temp) {
        lastTrigger = temp;

        doDownload();

        setTimeout(function () {
            let filePath = __dirname + '/../current.mp4';
            twittBot.postMediaChunked({file_path: filePath}, function (err, data, response) {

                twittBot.post('statuses/update', {
                    status: getTwittText(),
                    media_ids: [data.media_id_string]
                }).then(function (resp) {
                    console.log(arguments);
                   console.log('tweet created at:',moment(resp.data.created_at).format('DD/MM/YYYY HH:mm'));
                    deleteGeneratedFiles();
                })
            });
        }, 15000);
    }

    setTimeout(runTime, 60000);
}

runTime();


function getTwittText() {
    return mp3Name.split('.')[0].replace(/_|-|[a-z][0-9]+/gi, ' ') + ' #kaamelott #citationDuJour';
}

function doDownload() {

    download().then(async function (data) {
        mp3Name = data;
        let request = await twittBot.get('statuses/user_timeline');
        let twittsText = request.data.map(function (current) {
            return current.text.split(' https://')[0]
        });
        if (-1 !== twittsText.indexOf(getTwittText())) {
            deleteGeneratedFiles();
            doDownload();
            console.log('DO DOWNLOAD AGAIN! because duplicate tweet: ' + getTwittText());
        }
    });
}

function deleteGeneratedFiles() {
    fs.unlinkSync(__dirname + '/../current.mp4');
    fs.unlinkSync(__dirname + '/../' + mp3Name);
    fs.unlinkSync(__dirname + '/../mergedFile.mp3');
}