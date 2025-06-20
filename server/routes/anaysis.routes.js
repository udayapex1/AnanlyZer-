import express from "express";
import { analyzeCode } from "../controller/analysis.controller.js";

const router = express.Router();

router.post('/analyze', analyzeCode);
// router.post('/saveAnalysis', isAuthenticate, saveAnalysis);

export default router;