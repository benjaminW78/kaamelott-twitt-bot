const twit = require('twit');
const config = require('../config.js');
const fs = require('fs');

const twittBot = new twit(config);

const download = require('./download');

let mp3Name;

download().then(function (data) {
    mp3Name = data;
});
setTimeout(function () {
    let filePath = './current.mp4';
    twittBot.postMediaChunked({file_path: filePath}, function (err, data, response) {

        twittBot.post('statuses/update', {
            status: mp3Name.split('.')[0].replace(/_|[0-9]+/gi, ' ') + ' #kaamelott #citationDuJour',
            media_ids: [data.media_id_string]
        });
    });
}, 15000);
