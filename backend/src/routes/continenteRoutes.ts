import express from "express";
import {
  createContinenteController,
  getContinentesController,
  getContinenteController,
  updateContinenteController,
  deleteContinenteController,
} from "../controllers/continenteController";

const router = express.Router();

router.post("/", createContinenteController);
router.get("/:id", getContinenteController);
router.get("/", getContinentesController);
router.put("/:id", updateContinenteController);
router.delete("/:id", deleteContinenteController);

export default router;
