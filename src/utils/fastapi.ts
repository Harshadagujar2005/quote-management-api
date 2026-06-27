import axios from "axios";
import { FastAPIError } from "./errors";

const FASTAPI_URL = process.env.FASTAPI_URL || "";

export interface AnalysisResponse {
  risk: string;
  missing_items: string[];
  confidence: number;
}

// Mock data pool for realistic variation
const riskLevels = ["Low", "Medium", "High"];
const possibleMissingItems = [
  "Structural drawings",
  "Load requirements",
  "Site survey",
  "Insurance certificate",
  "Zoning approval",
  "Environmental report",
  "Contractor license",
];

function getMockAnalysis(quote_id: string): AnalysisResponse {
  // Deterministic-ish based on quote_id so same ID gives same result
  const seed = quote_id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const risk = riskLevels[seed % 3];
  const confidence = 75 + (seed % 25);
  const itemCount = (seed % 3) + 1;
  const missing_items = possibleMissingItems.slice(seed % 4, (seed % 4) + itemCount);

  return { risk, missing_items, confidence };
}

export async function callFastAPI(quote_id: string): Promise<AnalysisResponse> {
  // If FASTAPI_URL is set, call real service; otherwise use mock
  if (FASTAPI_URL) {
    try {
      const response = await axios.post(
        `${FASTAPI_URL}/analyze`,
        { quote_id },
        { timeout: 10000 }
      );

      const data = response.data;

      // Validate response shape
      if (
        typeof data.risk !== "string" ||
        typeof data.confidence !== "number" ||
        !Array.isArray(data.missing_items)
      ) {
        throw new FastAPIError("FastAPI returned an unexpected response format");
      }

      return data as AnalysisResponse;
    } catch (err: any) {
      if (err instanceof FastAPIError) throw err;
      if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
        throw new FastAPIError("FastAPI service is unreachable");
      }
      if (err.response) {
        throw new FastAPIError(`FastAPI responded with error: ${err.response.status}`);
      }
      throw new FastAPIError("Failed to communicate with FastAPI service");
    }
  }

  // Mock mode — simulate slight delay
  await new Promise((res) => setTimeout(res, 200));
  return getMockAnalysis(quote_id);
}
