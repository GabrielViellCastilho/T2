import express from "express";
import {
  createCidadeController,
  getCidadesController,
  getCidadeController,
  updateCidadeController,
  deleteCidadeController,
} from "../controllers/cidadeController";

const router = express.Router();

router.post("/", createCidadeController);
router.get("/:id", getCidadeController);
router.get("/", getCidadesController);
router.put("/:id", updateCidadeController);
router.delete("/:id", deleteCidadeController);

export default router;
