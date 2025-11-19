import express from "express";
import {
  createPaisController,
  getPaisesController,
  getPaisByIdController,
  updatePaisController,
  deletePaisController,
} from "../controllers/paisController";

const router = express.Router();

router.post("/", createPaisController);


router.get("/", getPaisesController);

router.get("/:id", getPaisByIdController);

router.put("/:id", updatePaisController);
router.delete("/:id", deletePaisController);

export default router;
