import * as repo from "../repositories/quote.repository";
import { callFastAPI } from "../utils/fastapi";
import { NotFoundError } from "../utils/errors";
import { CreateQuoteInput } from "../utils/validators";

export async function listQuotes(page: number, limit: number, search?: string) {
  const result = await repo.getAllQuotes(page, limit, search);

  const quotes = result.quotes.map((q: any) => ({
    ...q,
    analysis: q.analysis
      ? {
          ...q.analysis,
          missing_items: JSON.parse(q.analysis.missing_items),
        }
      : null,
  }));

  return {
    data: quotes,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    },
  };
}

export async function getQuote(id: string) {
  const quote = await repo.getQuoteById(id);
  if (!quote) throw new NotFoundError("Quote");

  return {
    ...quote,
    analysis: quote.analysis
      ? {
          ...quote.analysis,
          missing_items: JSON.parse(quote.analysis.missing_items),
        }
      : null,
  };
}

export async function createQuote(data: CreateQuoteInput) {
  return await repo.createQuote(data);
}

export async function analyzeQuote(id: string) {
  const quote = await repo.getQuoteById(id);
  if (!quote) throw new NotFoundError("Quote");

  // Call FastAPI (real or mock)
  const analysis = await callFastAPI(id);

  // Save or update analysis result
  await repo.saveAnalysisResult(
    id,
    analysis.risk,
    analysis.confidence,
    analysis.missing_items
  );

  return {
    quote_id: id,
    customer: quote.customer,
    project: quote.project,
    status: quote.status,
    estimated_value: quote.estimated_value,
    analysis: {
      risk: analysis.risk,
      confidence: analysis.confidence,
      missing_items: analysis.missing_items,
      analyzed_at: new Date().toISOString(),
    },
  };
}

export async function updateStatus(id: string, status: string) {
  const quote = await repo.getQuoteById(id);
  if (!quote) throw new NotFoundError("Quote");

  return await repo.updateQuoteStatus(id, status);
}
