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

    console.log('current config: \n', config);

    let twittBot = new twit(config);
    return {
        getTwittBot: function () {
            if (!twittBot) {
                twittBot = new twit(config);
            }
            return twittBot;
        },
        getConfig: function () {
            return config
        }
    }
}
let twittObject = TwittBot();
module.exports.twittBot = twittObject.getTwittBot();
module.exports.config = twittObject.getConfig();