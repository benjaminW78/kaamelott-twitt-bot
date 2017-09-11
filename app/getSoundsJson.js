const request = require('request-promise-native');

module.exports = async function getSoundsList(mp3Name) {
    let data = JSON.parse(await request('https://raw.githubusercontent.com/2ec0b4/kaamelott-soundboard/master/sounds/sounds.json'));
    return data;
};
