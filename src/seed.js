const {Prisma, PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

let ich = prisma.user.create({
    data: {
        uuid: Math.floor(Math.random()*Math.pow(2, 64)),
        name: "teremich",
        email: "987654321boom.s@gmail.com",
        passwordHash: "9��►O♠[\"��↑oɽ9♦f��♀↔mg,Mb♠�♠",
        bio: {
            description: "Hi, I'm the backend dev of this beautiful site :)",
            social: {
                github: "teremich"
            }
        }
    }
});

prisma.user.count().then(console.log);