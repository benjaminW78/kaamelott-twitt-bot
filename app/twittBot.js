const config = require('../config.js');
const twit = require('twit');

function TwittBot() {

    if (process.env['consumer_key']) {
        config.consumer_key = process.env['consumer_key'];
        config.consumer_secret = process.env['consumer_secret'];
        config.access_token = process.env['access_token'];
        config.access_token_secret = process.env['access_token_secret'];
        config.trigger_hours = process.env['trigger_hours'];
    }

    console.log('current config: ', config);

    let twittBot = new twit(config);
    let instance = undefined;
    return {
        getTwittBot: function () {
            if (!twittBot) {
                twittBot = new twit(config);
            }
            return twittBot;
        }
    }
}
module.exports = TwittBot().getTwittBot();