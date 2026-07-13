import { Request, Response } from "express";

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getMaps = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getPlots = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getMachines = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getPlantings = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getHarvests = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getIrrigations = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getAudit = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json([]);
};

export const getFinance = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ receitas: 0, despesas: 0, saldo: 0 });
};