import { publicProject, ownerOnlyProject, Additional } from "./scope";
import { Database } from "models/database";
import { getUserObject, hash, level } from "./auth";

// TODO (post v1.0): create and use helper functions for private, public and owner-only data, so the api doesnt have to sanitize
// additionally maybe make the calls to the functions in this file standardized

export const db = new Database();
export async function getProjects(scope: level, where?: { id?: number, skip?: number, take?: number }) {
    const res = await db.prisma.project.findMany({
        where: {
            id: where?.id
        },
        skip: where?.skip ?? 0,
        select: scope >= level.OWNER ? ownerOnlyProject : publicProject,
        // returns at most 50 projects (use skip to paginate)
        take: (where?.take && where.take < 50 && where.take > 0) ? where?.take : 50
    });
    for (let p of res) {
        if (scope < level.MEMBER) {
            (<Additional>p.additional).private = {};
        }
        for (let u of [...p.members, p.owner]) {
            (<Additional>u.additional).private = {};
            (<Additional>u.additional).public = {};
        }
    }
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
                    id: true
                }
            }
        }
    });
    if (previousProjects?.ownerOf?.length && previousProjects.ownerOf.length > 255) {
        return 0; // no one can have more than 255 projects
    }
    return (await db.prisma.project.create({
        data: {
            description: data.description,
            details: {},
            name: data.name,
            tasks: [],
            additional: data.additional,
            ownerId: data.ownerId
        },
        select: {
            id: true
        }
    })).id;
}

export async function patchProject() {
    // TODO: implement
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

export async function makeJoinRequest(userId: number, projectId: number, message: string): Promise<boolean> {
    // if the user already made a jr
    if ((await db.prisma.joinRequest.findUnique({
        where: {
            senderId_receiverId: {
                receiverId: projectId,
                senderId: userId
            }
        }
        // or that user is banned from the project
    })) || (await db.prisma.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            banList: {
                where: {
                    uuid: userId
                }
            }
        }
    }))?.banList.length) {
        // dont create the join request
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
    const project = (await getProjects(level.ADMIN, { id: params.projectId }))[0];
    if (project === undefined) {
        return false;
    }
    const leavingUser = await getUserObject(level.ADMIN, params.leavingUser);
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
        } else if (project.owner.uuid == leavingUser.uuid) {
            // TODO: what if the owner leaves
            // maybe the first member in the list becomes the new Owner
            // what if the new Owner has too many projects and is the Admin treated equally in that case?
            // what if all members either have too many projects
            // TODO: delete project if there are no members and no one to become owner
            // How about just letting members leave and owners can only delete projects not leave them?
            return true;
        }
    } else {
        const leaveInitiator = await getUserObject(level.ADMIN, params.leaveInitiator);
        if (!leaveInitiator) {
            return false;
        }
        if (leaveInitiator.uuid == project.owner.uuid) {
            let banList: {
                connect: {
                    uuid: number;
                };
            } | undefined = undefined;
            if (params.ban) {
                banList = {
                    connect: {
                        uuid: leavingUser.uuid
                    }
                }
            }
            await db.prisma.project.update({
                where: {
                    id: project.id
                },
                data: {
                    members: {
                        disconnect: {
                            uuid: leavingUser.uuid
                        }
                    },
                    banList
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
                if ((<Additional>leavingUser.additional).private.kickmsgs) {
                    ((<Additional>leavingUser.additional).private.kickmsgs as { projectid: number, msg: string }[]).push(newEntry)
                } else {
                    ((<Additional>leavingUser.additional).private.kickmsgs as { projectid: number, msg: string }[]) = [newEntry];
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

export async function updateUser(uuid: number, newData: { bio?: any; email?: string, name?: string; password?: string; additional?: any } ) {
    await db.prisma.user.update({
        where: {
            uuid
        },
        data: {
            bio: newData.bio,
            email: newData.email,
            name: newData.name
        }
    });
    if (newData.password) {
        let pwHash = hash(uuid + newData.password);
        await db.updatePassword(uuid, pwHash);
    }
}

export type { User, Project, JoinRequest } from "models/database";
export { statusCode } from "models/database";
