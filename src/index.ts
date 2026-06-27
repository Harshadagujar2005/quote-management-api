import express from "express";
import { quoteRoutes } from "./routes/quote.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestIdMiddleware } from "./middleware/requestId";
import { loggerMiddleware } from "./middleware/logger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestIdMiddleware);
app.use(loggerMiddleware);

app.get("/", (_req, res) => {
  res.json({
    service: "Quote Backend Service",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      quotes: {
        list: "GET /quotes",
        create: "POST /quotes",
        get: "GET /quotes/:id",
        analyze: "POST /quotes/:id/analyze",
        updateStatus: "PATCH /quotes/:id/status"
      }
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/quotes", quoteRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
