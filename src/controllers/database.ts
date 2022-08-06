import { Prisma } from "@prisma/client";
import { Database } from "../models/database";

export const db = new Database();
export async function getProjectsPublic(where?: { id: number | undefined }): Promise<{
    id: number;
    additional: Prisma.JsonValue;
    description: string;
    name: string;
    details: Prisma.JsonValue;
    owner: {
        name: string;
        uuid: number;
    };
    members: {
        name: string;
        uuid: number;
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
            }
        }
    });
    return res;
}
export type projectData = { description: string, name: string, additional?: any, ownerId: number };
export async function postProject(data: projectData): Promise<number> {
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

export { User, Project, statusCode } from "../models/database";