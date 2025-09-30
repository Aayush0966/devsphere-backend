import { tagController } from "@/controllers/tag.controller";
import { authMiddleware, isModerator } from "@/middleware/auth.middleware";
import { Router } from "express";

const tagRouter = Router();

// Public Routes
tagRouter.get("/", tagController.getAllTags);
tagRouter.get("/:id", tagController.getTagById);

// Private Routes (require authentication and moderator role)
tagRouter.use(authMiddleware, isModerator);
tagRouter.post("/", tagController.createTag);
tagRouter.patch("/:id", tagController.updateTag);
tagRouter.delete("/:id", tagController.deleteTag);

export default tagRouter;
