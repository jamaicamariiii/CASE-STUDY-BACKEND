import express from "express";
import { updateCleaner, deleteCleaner, getAllCleaner, getSingleCleaner, getCleanerProfile } from "../Controllers/cleanerController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";

import reviewRouter from "./review.js";

const router = express.Router();

//nested route
router.use("/:cleanerId/reviews", reviewRouter)

router.get("/:id", getSingleCleaner);
router.get("/", getAllCleaner);
router.put("/:id",  authenticate, restrict(["cleaner"]),updateCleaner);
router.delete("/:id",  authenticate, restrict(["cleaner"]),deleteCleaner);

router.get('/profile/me', authenticate, restrict(["cleaner"]), getCleanerProfile);

export default router;