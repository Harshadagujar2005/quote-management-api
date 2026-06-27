import prisma from "../models/prismaClient";
import { CreateQuoteInput } from "../utils/validators";
import { DatabaseError } from "../utils/errors";

export async function getAllQuotes(page: number, limit: number, search?: string) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { customer: { contains: search } },
          { project: { contains: search } },
        ],
      }
    : {};

  try {
    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_date: "desc" },
        include: { analysis: true },
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    return { quotes, total, page, limit };
  } catch {
    throw new DatabaseError("Failed to fetch quotes");
  }
}

export async function getQuoteById(id: string) {
  try {
    return await prisma.quoteRequest.findUnique({
      where: { id },
      include: { analysis: true },
    });
  } catch {
    throw new DatabaseError("Failed to fetch quote");
  }
}

export async function createQuote(data: CreateQuoteInput) {
  try {
    return await prisma.quoteRequest.create({ data });
  } catch {
    throw new DatabaseError("Failed to create quote");
  }
}

export async function updateQuoteStatus(id: string, status: string) {
  try {
    return await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });
  } catch {
    throw new DatabaseError("Failed to update quote status");
  }
}

export async function saveAnalysisResult(
  quote_id: string,
  risk: string,
  confidence: number,
  missing_items: string[]
) {
  try {
    return await prisma.analysisResult.upsert({
      where: { quote_id },
      update: {
        risk,
        confidence,
        missing_items: JSON.stringify(missing_items),
        analyzed_at: new Date(),
      },
      create: {
        quote_id,
        risk,
        confidence,
        missing_items: JSON.stringify(missing_items),
      },
    });
  } catch {
    throw new DatabaseError("Failed to save analysis result");
  }
}
