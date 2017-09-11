module.exports = function getTwittText(mp3Name) {
    return mp3Name.split('.')[0].replace(/_|-|[a-z][0-9]+/gi, ' ') + ' #kaamelott #citationDuJour';
};
