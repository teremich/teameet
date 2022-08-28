import type { Prisma } from "@prisma/client";
import { Database } from "models/database";
import { getUserLevel, getUserObject } from "./auth";

export const db = new Database();
export async function getProjects(where?: { id?: number }): Promise<{
    id: number;
    additional: Prisma.JsonValue;
    description: string;
    name: string;
    details: Prisma.JsonValue;
    createdAt: Date;
    owner: {
        name: string;
        uuid: number;
    };
    members: {
        name: string;
        uuid: number;
    }[];
    joinRequests?: {
        sender: {
            name: string;
            uuid: number;
        },
        message: string;
    }[];
}[]> {
    const res = await db.prisma.project.findMany({
        where: {
            id: where?.id
        },
        select: {
            additional: true,
            description: true,
            id: true,
            name: true,
            details: true,
            createdAt: true,
            owner: {
                select: {
                    name: true,
                    uuid: true
                }
            },
            members: {
                select: {
                    uuid: true,
                    name: true
                }
            },
            joinRequests: {
                select: {
                    sender: {
                        select: {
                            uuid: true,
                            name: true
                        }
                    },
                    message: true
                }
            }
        }
    });
    return res;
}
export type projectData = { description: string, name: string, additional?: any, ownerId: number };
export async function postProject(data: projectData): Promise<number> {
    const previousProjects = await db.prisma.user.findUnique({
        where: {
            uuid: data.ownerId
        },
        select: {
            ownerOf: {
                select: {
                    createdAt: true
                }
            }
        }
    });
    if (previousProjects?.ownerOf?.length && previousProjects.ownerOf.length >= 255) {
        return 0;
    }
    return (await db.prisma.project.create({
        data: {
            description: data.description,
            details: {},
            name: data.name,
            tasks: {},
            additional: data.additional,
            ownerId: data.ownerId
        },
        select: {
            id: true
        }
    })).id;
}

export async function deleteProject(id: number) {
    return await db.prisma.project.delete({
        where: {
            id
        }
    });
}

export async function getJoinRequestsByProject(projectId: number) {
    return await db.prisma.joinRequest.findMany({
        where: {
            receiverId: projectId
        }
    });
}

export async function getJoinRequestsByUser(userId: number) {
    return await db.prisma.joinRequest.findMany({
        where: {
            senderId: userId
        }
    });
}

export async function makeJoinRequest(userId: number, projectId: number, message: string) {
    if (await db.prisma.joinRequest.findUnique({
        where: {
            senderId_receiverId: {
                receiverId: projectId,
                senderId: userId
            }
        }
    })) {
        return false;
    }
    await db.prisma.joinRequest.create({
        data: {
            receiverId: projectId,
            senderId: userId,
            message,
        }
    });
    return true;
}

export async function addMember(userid: number, projectid: number) {
    await db.prisma.project.update({
        where: {
            id: projectid
        },
        data: {
            members: {
                connect: {
                    uuid: userid
                }
            }
        }
    });
}

export async function deleteJoinRequest(userid: number, projectid: number) {
    await db.prisma.joinRequest.delete({
        where: {
            senderId_receiverId: {
                receiverId: projectid,
                senderId: userid
            }
        }
    });
    return;
}

export async function leave(params: {
    projectId: number,
    leavingUser: number,
    leaveInitiator: number,
    message?: string,
    ban: boolean
}) {
    const project = (await getProjects({ id: params.projectId }))[0];
    if (project === undefined) {
        return false;
    }
    const leavingUser = await getUserObject(params.leavingUser);
    if (!leavingUser) {
        return false;
    }
    if (params.leaveInitiator == params.leavingUser) {
        if (
            project.members.find((value, index, object) => {
                return value.uuid == leavingUser.uuid;
            })?.uuid == leavingUser.uuid
        ) {
            await db.prisma.project.update({
                where: {
                    id: project.id
                },
                data: {
                    members: {
                        disconnect: {
                            uuid: leavingUser.uuid
                        }
                    }
                }
            });
            return true;
        }
    } else {
        const leaveInitiator = await getUserObject(params.leaveInitiator);
        if (!leaveInitiator) {
            return false;
        }
        if (leaveInitiator.uuid == project.owner.uuid) {
            await db.prisma.project.update({
                where: {
                    id: project.id
                },
                data: {
                    members: {
                        disconnect: {
                            uuid: leavingUser.uuid
                        }
                    }
                }
            });
            if (params.message) {
                const newEntry = {
                    projectid: project.id,
                    msg: params.message
                };
                if (leavingUser.additional === null) {
                    leavingUser.additional = { private: {} };
                }
                if ((leavingUser.additional as any).private["kickmsgs"]) {
                    ((leavingUser.additional as any).private["kickmsgs"] as { projectid: number, msg: string }[]).push(newEntry)
                } else {
                    ((leavingUser.additional as any).private["kickmsgs"] as { projectid: number, msg: string }[]) = [newEntry];
                }
                await db.prisma.user.update({
                    where: {
                        uuid: leavingUser.uuid
                    },
                    data: {
                        additional: (leavingUser.additional as any)
                    }
                });
            }
            return true;
        }
    }
    return false;
}

export type { User, Project, JoinRequest } from "models/database";
export { statusCode } from "models/database"