import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes.ts";
import userInvitationsRoutes from "@/modules/userInvitations/userInvitations.routes.ts";
import clinicRoutes from "@/modules/clinics/clinics.routes.ts";

const v1Router: Router = Router();

v1Router.use("/auth", authRoutes);
v1Router.use("/invitations", userInvitationsRoutes);
v1Router.use("/clinics", clinicRoutes);

export default v1Router;
