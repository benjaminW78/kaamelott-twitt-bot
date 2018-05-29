const Q = require('q');
const getTwittText = require('./getTwittText');
const twittBot = require('./twittBot').twittBot;
const moment = require('moment');

function postTweetWithMediaText(mp3Name, soundsList) {
    let filePath = __dirname + '/../current.mp4';
    let deferred = new Q.defer();

    twittBot.postMediaChunked({file_path: filePath}, async function (err, data, response) {
        twittBot.post('statuses/update', {
            status: getTwittText(mp3Name, soundsList).twitt,
            media_ids: [data.media_id_string]
        }).then(function (resp) {

            console.log('tweet created at:', (moment(resp.data.created_at, 'ddd MMM DD HH:mm:ss +Z YYYY').utcOffset('+0200').format('DD-MM-YYYY HH:mm')));
            console.log('\n');
            console.log('tweet created text: ' + resp.data.text);
            deferred.resolve();
        });
    });

    return deferred.promise;
}

module.exports = postTweetWithMediaText;