import {Database, User, Project, statusCode} from "../models/database";

export const db = new Database();
export {User, Project, statusCode};