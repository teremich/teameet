"use strict";
const PrismaClient = require('@prisma/client').PrismaClient;
const Prisma = require('@prisma/client').Prisma;
const readline = require("readline-sync");

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
//     console.warn('\x1b[31m%s\x1b[0m', 'You are deleting all data!');
//     if (readline.question("Are you sure? (Y/N)\n> ") != "Y") {
//         process.exit(1);
//     }
//     await prisma.project.deleteMany({});
//     await prisma.joinRequest.deleteMany({});
//     await prisma.user.deleteMany({});

//     const user = await prisma.user.create({
//         data: {
//             uuid: Math.floor(Math.random()*0x100000000),
//             name: "teremich",
//             email: "987654321boom.s@gmail.com",
//             passwordHash: "0780da71d547a6289320ca99c20f3f66044e924267e46e89991a99a7d06ea473",

//             bio: {
//                 description: "Hi, I'm the back-end dev of this beautiful site :)",
//                 social: {
//                     github: "teremich"
//                 }
//             }
//         }
//     });

//     const project = await prisma.project.create({
//         data: {
//             ownerId: user.uuid,
//             name: "Teameet",
//             description: "Teameet ist eine tolle Plattform, \
// wo man seine Projekte der Öffentlichkeit zeigen kann und wenn \
// sich interessierte finden, können sie einfach beitreten und \
// mithelfen!\n\
// Wenn ihr mithelfen wollt, könnt ihr ja bei unserem github mithelfen: https://github.com/teremich/teameet/\n\
// oder auf unseren TS kommen: ts.blixary.eu",
//             tasks: {
//                 "think of database structure": 0,
//                 "creating the front-end design": "Samuel"
//             },
//             details: {
//                 backend: ["node.js", "prisma", "express"],
//                 frontend: ["angular", "react", "vue"]
//             }
//         }
//     });

    // const samuel = await prisma.user.create({
    //     data: {
    //         uuid: Math.floor(Math.random()*0x100000000),
    //         name: "blixary",
    //         email: "blixary@gmail.com",
    //         passwordHash: "somehash",
    //         bio: {
    //             description: "yay",
    //             social: {}
    //         },
    //         additional: {
    //             "this can be": ["whatever", "I", "want"]
    //         }
    //     }
    // });

    // const update = await prisma.user.update({
    //     data: {
    //         ownerOf: {
    //             connect: {
    //                 id: (await prisma.project.findFirst({
    //                     select: {
    //                         id: true
    //                     },
    //                     where: {
    //                         ownerId: 1697772467
    //                     }
    //                 })).id
    //             }
    //         },
    //     },
    //     where: {
    //         uuid: 1697772467
    //     }
    // });

    // let samirequest = await prisma.joinRequest.create({
    //     data: {
    //         senderId: (await prisma.user.findFirst({
    //             where: {
    //                 NOT: {
    //                     email: "987654321boom.s@gmail.com"
    //                 }
    //             }
    //         })).uuid,
    //         receiverId: 2,
    //         message: "Ich will mitmachen :)",
    //         additional: {
    //             "ist Sami blöd?": false,
    //             "ist Michi blöd?": false
    //         }
    //     }
    // });

    // async function acceptJoinRequest(r) {
    //     await prisma.project.update({
    //         data: {
    //             members: {
    //                 connect: {
    //                     uuid: r.senderId
    //                 }
    //             }
    //         },
    //         where: {
    //             id: r.receiverId
    //         }
    //     });
    //     await prisma.joinRequest.delete({
    //         where: {
    //             senderId_receiverId: {
    //                 receiverId: r.receiverId,
    //                 senderId: r.senderId
    //             }
    //         }
    //     });
    // }
    // for (let r of await prisma.joinRequest.findMany()) {
    //     await acceptJoinRequest(r);
    // }

    const resp = await prisma.user.findUnique({
        where: {
            uuid: 1697772467
        },
        include: {
            memberOf: {
                select: {
                    members: {
                        where: {
                            NOT: {
                                uuid: 1697772467
                            }
                        }
                    },
                    owner: {
                        select: {
                            name: true,
                            uuid: true
                        }
                    },
                    id: true,
                    name: true
                }
            },
            ownerOf: {
                select: {
                    members: {
                        select: {
                            name: true,
                            uuid: true
                        }
                    },
                    owner: {
                        select: {
                            name: true,
                            uuid: true
                        }
                    },
                    id: true,
                    name: true
                }
            }
        }
    });

    let people = {};
    for (let p of resp.memberOf) {
        if (!(p.name in people)) {
            people[p.name] = [];
        }
        people[p.name].push(p.owner);
        people[p.name].push(...p.members);
    }
    for (let p of resp.ownerOf) {
        if (!(p.name in people)) {
            people[p.name] = [];
        }
        // people[p.name].push(p.owner);
        people[p.name].push(...p.members);
    }

    console.log(people);


    // let users = await prisma.user.findMany({
    //     include: {
    //         joins: true,
    //         memberOf: true,
    //         ownerOf: true
    //     }
    // });
    // console.log(users);
    // let projects = await prisma.project.findMany({
    //     include:{
    //         joinRequests: true,
    //         members: true,
    //         owner: true
    //     }
    // })
    // console.log(projects);
    // let requests = await prisma.joinRequest.findMany();
    // console.log(requests);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        // Disconnect Prisma Client
        await prisma.$disconnect();
    })