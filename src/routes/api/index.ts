import { Router } from "express";
// import type { Request, Response } from "express";
import * as v0 from "./v0";
// import * as v1 from "./v1";

export const router = Router();

router.use("/v0", v0.router);
// router.use();