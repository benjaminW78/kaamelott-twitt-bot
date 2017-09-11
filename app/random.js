module.exports = function randomNumber(array,myNumber) {
    const max = (array)?array.length:myNumber;
    const min = 0;
    return Math.round(Math.random() * (max - min) + min);
};