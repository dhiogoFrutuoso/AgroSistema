import { Request, Response } from "express";
import { Transaction } from "../models/Transaction.js";

export class FinancialController {
  // POST /api/financial/transactions - Lança uma movimentação (Receita ou Despesa)
  static async createTransaction(req: Request, res: Response): Promise<any> {
    try {
      const { description, type, category, value, dueDate, paymentDate, status, farmId, machineId, notes } = req.body;

      if (!description || !type || !category || value === undefined || !dueDate) {
        return res.status(400).json({ error: "Campos obrigatórios: description, type, category, value e dueDate" });
      }

      const transaction = new Transaction({
        description,
        type,
        category,
        value,
        dueDate,
        paymentDate,
        status,
        farmId: farmId || undefined,
        machineId: machineId || undefined,
        notes
      });

      await transaction.save();
      return res.status(201).json({ success: true, data: transaction });
    } catch (error) {
      console.error("❌ Erro ao criar lançamento financeiro:", error);
      return res.status(500).json({ error: "Erro interno ao salvar lançamento" });
    }
  }

  // GET /api/financial/transactions - Lista o livro caixa completo trazendo os relacionamentos
  static async listTransactions(req: Request, res: Response): Promise<any> {
    try {
      const transactions = await Transaction.find()
        .populate("farmId", "name city")
        .populate("machineId", "name type");

      // Calcula um resumo rápido do caixa atual
      const totalRevenue = transactions.filter(t => t.type === "receita" && t.status === "pago").reduce((acc, t) => acc + t.value, 0);
      const totalExpense = transactions.filter(t => t.type === "despesa" && t.status === "pago").reduce((acc, t) => acc + t.value, 0);

      return res.status(200).json({
        totalRecords: transactions.length,
        balanceSummary: {
          revenues: totalRevenue,
          expenses: totalExpense,
          netBalance: totalRevenue - totalExpense
        },
        data: transactions
      });
    } catch (error) {
      console.error("❌ Erro ao listar lançamentos financeiros:", error);
      return res.status(500).json({ error: "Erro interno ao buscar lançamentos" });
    }
  }
}