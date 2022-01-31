const {Database} = require("./database");

class Server{
    constructor() {
        this.database = new Database();
    }
    middleware() {}
    routes() {}
    start() {
        this.middleware();
        this.routes();
    }
}

module.exports = {
    Server
};
