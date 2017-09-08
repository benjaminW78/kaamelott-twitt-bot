module.exports = function randomNumber(array) {
    const max = array.length;
    const min = 0;
    return Math.round(Math.random() * (max - min) + min);
};