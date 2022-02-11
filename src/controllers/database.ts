import {Database, JsonObject} from "../models/database";

export const db = new Database();
export type proj = {id: number, name: string, owner: string, description: string, languages?: string, additional?: any};
export async function getProjects(where?: {id: number | undefined}): Promise<proj[]> {
    let resList: proj[] = [];
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
                    name: true
                }
            }
        }
    });
    res.forEach(item => {
        resList.push({
            id: item.id,
            name: item.name,
            owner: item.owner.name,
            additional: item.additional,
            description: item.description,
            languages: ((item.details as JsonObject)["languages"] as string[] | undefined)?.join(", ") ?? "",
        });
    });
    return resList;
}

export {User, Project, statusCode} from "../models/database";