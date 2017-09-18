const Q = require('q');
const getTwittText = require('./getTwittText');
const twittBot = require('./twittBot');
const moment = require('moment');

function postTweetWithMediaText(mp3Name, soundsList) {
    let filePath = __dirname + '/../current.mp4';
    let deferred = new Q.defer();

    twittBot.postMediaChunked({file_path: filePath}, async function (err, data, response) {
        twittBot.post('statuses/update', {
            status: getTwittText(mp3Name, soundsList).twitt,
            media_ids: [data.media_id_string]
        }).then(function (resp) {

            console.log(resp.data.text);
            console.log('tweet created at:', (moment(resp.data.created_at, 'ddd MMM DD HH:mm:ss +Z YYYY').format('DD-MM-YYYY HH:mm')));
            deferred.resolve();
        });
    });

    return deferred.promise;
}

module.exports = postTweetWithMediaText;