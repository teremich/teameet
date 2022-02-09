import {Router, Request, Response} from "express";
import * as express from "express";
import * as api from "./api"
import * as view from "./view"
import {BUILD_ROUTE} from "../controllers/auth";

export const router = Router();


router.use("/api", api.router);

router.use("/", view.router);

router.use(express.static(BUILD_ROUTE));
