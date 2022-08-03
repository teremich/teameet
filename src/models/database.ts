"use strict";
import { PrismaClient, User, Project, Prisma } from "@prisma/client";
export type JsonObject = Prisma.JsonObject;
export { User, Project };

export enum statusCode {
    SUCCESS = 0,
    ERROR_DUPLICATE_EMAIL,
    ERROR_UNKNOWN_DUPLICATE,
    ERROR_DB_FULL,
    ERROR_NAME_TOO_LONG
}

export class Database {
    prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async isMember(userId: number, projectId: number): Promise<boolean> {
        const members: { members: { uuid: number }[] } | null = (await this.prisma.project.findUnique({
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

    async addUser(userdata: { uuid: number, name: string, email: string, passwordHash: string, bio: any, additional?: any }): Promise<{ code: statusCode, msg: string, detail: string, value?: any }> {
        /**
        userdata={
            name: String,
            email: String,
            passwordHash: String,
            bio: Object // not nullable! pls empty Obj,
            additional: Object?
        }
        **/
        for (let i = 0; i < 0x100; i++) {
            try {
                const p = await this.prisma.user.create({
                    data: {
                        uuid: userdata.uuid + i,
                        name: userdata.name,
                        email: userdata.email,
                        passwordHash: userdata.passwordHash,
                        bio: userdata.bio,
                        additional: userdata.additional
                    }
                });
                return { code: statusCode.SUCCESS, msg: "success", detail: "user was created", value: p };
            } catch (e: any) {
                if (e.code === "P2002") {
                    switch (e.meta.target[0]) {
                        case "uuid":
                            break;
                        case "email":
                            return { code: statusCode.ERROR_DUPLICATE_EMAIL, msg: "failure", detail: "duplicate email" }
                        default:
                            console.error(e);
                            return { code: statusCode.ERROR_UNKNOWN_DUPLICATE, msg: "failure", detail: "something duplicate, dont know what", value: e }
                    }
                } else if (e.code === "P2000") {
                    // console.log(e.meta);
                    return {
                        code: statusCode.ERROR_NAME_TOO_LONG,
                        msg: "failure",
                        detail: `${e.meta.column_name} was too long, if not available it's the name`
                    };
                } else {
                    throw e;
                }
            }
        }
        return { code: statusCode.ERROR_DB_FULL, msg: "failure", detail: "0x100 userids checked, non were available" };
    }
}
