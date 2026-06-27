import { Request, Response, NextFunction } from "express";
import * as service from "../services/quote.service";
import {
  createQuoteSchema,
  updateStatusSchema,
  paginationSchema,
} from "../utils/validators";
import { ValidationError } from "../utils/errors";
import { ZodError } from "zod";

export async function getAllQuotes(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError(parsed.error.errors[0].message);

    const { page, limit, search } = parsed.data;
    const result = await service.listQuotes(page, limit, search);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getQuoteById(req: Request, res: Response, next: NextFunction) {
  try {
    const quote = await service.getQuote(req.params.id);
    res.json(quote);
  } catch (err) {
    next(err);
  }
}

export async function createQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createQuoteSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ");
      throw new ValidationError(msg);
    }

    const quote = await service.createQuote(parsed.data);
    res.status(201).json(quote);
  } catch (err) {
    if (err instanceof ZodError) return next(new ValidationError(err.errors[0].message));
    next(err);
  }
}

export async function analyzeQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.analyzeQuote(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0].message);
    }

    const updated = await service.updateStatus(req.params.id, parsed.data.status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
