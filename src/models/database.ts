"use strict";
import {PrismaClient} from "@prisma/client";
import {hash} from "../controllers/auth"

export class Database{
    prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async isMember(userId: number, projectId: number) {
        return userId in (await this.prisma.project.findUnique({
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
        })).members.values();
    }
    async isOwner(userId: number, projectId: number) {
        return userId == (await this.prisma.project.findUnique({
            where: {
                id: projectId
            },
            select: {
                ownerId: true
            }
        })).ownerId
    }

    async getHash(email: string) {
        return (await this.prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                passwordHash: true
            }
        })).passwordHash
    }

    async createUser(detail: {bio: any, email: string, name: string, password: string}) {
        return (await this.prisma.user.create({
            data: {
                bio: detail.bio,
                email: detail.email,
                name: detail.name,
                passwordHash: hash(detail.password),
                uuid: Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)
            },
            select: {
                uuid: true
            }
        })).uuid
    }

    async seed(): Promise<boolean> {
        const id: number = (await this.prisma.project.create({
            data: {
                name: "awsome proj",
                description: "",
                details: {},
                tasks: {},
                owner: {
                    create: {
                        uuid: 471894,
                        bio: {},
                        email: "",
                        passwordHash: "pwhash",
                        name: "{}"
                    }
                }
            }
        })).id;
        const a = await this.prisma.project.findUnique({
            where: {
                id
            },
            select: {
                members: {
                    select: {
                        uuid: true
                    }
                }
            }
        })
        if (a === null) {
            console.error("found nothing");
            process.exit(1);
        }
        return 47238 in a.members.values();
    }
}
