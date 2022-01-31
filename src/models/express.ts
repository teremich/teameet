const {Database} = require("./database");

export class Server{
    constructor() {
        this.database = new Database();
    }
    middleware() {

    }
    routes() {
        
    }
    start() {
        this.middleware();
        this.routes();
    }
}
