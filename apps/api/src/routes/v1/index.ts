import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes.ts";

const v1Router: Router = Router();

v1Router.use("/auth", authRoutes);

export default v1Router;
