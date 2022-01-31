function randomToken() {
    token = "";
    for (let i = 0; i < 64; i++) {
        Math.random();
    }
        
}

module.exports = {
    randomToken
};