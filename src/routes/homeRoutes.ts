import { Router } from "express";
import { getHome } from "../controller/homeController";

const router = Router();

router.get("/", getHome);

export default router;
