"use strict";
import {PrismaClient, User, Project} from "@prisma/client";
import {hash} from "../controllers/auth"
export {User, Project};
export class Database{
    prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async isMember(userId: number, projectId: number): Promise<boolean> {
        const members: {members: {uuid: number}[]} | null = (await this.prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                members: {
                    select: {
                        uuid: true
                    }
                }
            }
        }))
        if (!(members?.members)) {
            return false;
        }
        return members.members.find((value, index, object) => {
            return value.uuid == userId;
        })?.uuid == userId;
    }
    async isOwner(userId: number, projectId: number) {
        return userId == (await this.prisma.project.findUnique({
            where: {
                id: projectId
            },
            select: {
                ownerId: true
            }
        }))?.ownerId
    }

    async createUser(detail: {bio: any, email: string, name: string, password: string}) {
        return (await this.prisma.user.create({
            data: {
                bio: detail.bio,
                email: detail.email,
                name: detail.name,
                passwordHash: hash(detail.password),
                uuid: Math.floor(Math.random()*0x100000000)
            },
            select: {
                uuid: true
            }
        })).uuid
    }

    async seed(): Promise<number> {
        const a = await this.prisma.user.create({
            data: {
                email: "someEmail@mail.test",
                passwordHash: hash("bestPasswordInTheWorld"),
                bio: {},
                name: "my Name",
                uuid: Math.floor(Math.random()*0x100000000)
            },
            select: {
                uuid: true
            }
        })
        if (a === null) {
            console.error("found nothing");
            process.exit(1);
        }
        return a.uuid;
    }
}
