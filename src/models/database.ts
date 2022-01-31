const {PrismaClient} = require("@prisma/client");

class Database{
    constructor() {
        this.prisma = new PrismaClient();
    }
}

module.exports = {
    Database
};
