const request = require('request-promise-native')

module.exports = function getTwittText(mp3Name, soundsList) {
    let currentItem = soundsList.find(current => {
        return current.file === mp3Name
    })

    if (currentItem) {
        currentItem.twitt = currentItem.title.substring(0, 97) + '... #' + currentItem.character.replace(/ ,| |'|-|,/gi, '') + ' #kaamelott #citationDuJour'
    }

    return currentItem
}
