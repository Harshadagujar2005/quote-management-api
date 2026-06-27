import { Router } from "express";
import * as controller from "../controllers/quote.controller";

export const quoteRoutes = Router();

quoteRoutes.get("/", controller.getAllQuotes);
quoteRoutes.get("/:id", controller.getQuoteById);
quoteRoutes.post("/", controller.createQuote);
quoteRoutes.post("/:id/analyze", controller.analyzeQuote);
quoteRoutes.patch("/:id/status", controller.updateStatus);
