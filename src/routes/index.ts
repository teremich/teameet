import {Router, Request, Response} from "express";
import * as express from "express";
import * as api from "./api"
import {BUILD_ROUTE} from "../controllers/views"

export const router = Router();

router.use("/api", api.router);
router.use(express.static(BUILD_ROUTE));
