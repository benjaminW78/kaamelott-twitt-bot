module.exports = function cleanName(name) {
    return name.replace(/ |\'|/gi,'');
};