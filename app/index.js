const twit = require('twit');
const config = require('../config.js');
const fs = require('fs');
const moment = require('moment');

const twittBot = new twit(config);

const download = require('./download');

let mp3Name;
let lastTrigger;

function runTime() {
    let temp = moment().format('HH:mm');
    if (-1 !== config.trigger_hours.indexOf(temp) && lastTrigger != temp) {
        lastTrigger = temp;

        doDownload();

        setTimeout(function () {
            let filePath = './current.mp4';
            twittBot.postMediaChunked({file_path: filePath}, function (err, data, response) {

                twittBot.post('statuses/update', {
                    status: getTwittText(),
                    media_ids: [data.media_id_string]
                }).then(function () {
                    console.log(arguments);
                    fs.unlinkSync('current.mp4');
                    fs.unlinkSync(mp3Name);
                    fs.unlinkSync('mergedFile.mp3');
                })
            });
        }, 15000);
    }

    setTimeout(runTime, 60000);
}

runTime();
function getTwittText() {
    return mp3Name.split('.')[0].replace(/_|[0-9]+/gi, ' ') + ' #kaamelott #citationDuJour';
}

function doDownload() {

    download().then(async function (data) {
        mp3Name = data;
        let request = await twittBot.get('statuses/user_timeline');
        let twittsText = request.data.map(function (current) {
            return current.text.split(' https://')[0]
        });
        if (-1 !== twittsText.indexOf(getTwittText())) {
            doDownload();
            console.log('DO DOWNLOAD AGAIN! because duplicate tweet: ' + getTwittText());
        }
    });
}