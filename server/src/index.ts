import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { feeBumpHandler } from "./handlers/feeBump";
import { loadConfig } from "./config";

dotenv.config();

const app = express();
app.use(express.json());

const config = loadConfig();

app.get("/health", (req: Request, res: Response) => {
  const accounts = config.feePayerAccounts.map((a) => ({
    publicKey: a.publicKey,
    status: "active",
  }));
  res.json({
    status: "ok",
    fee_payers: accounts,
    total: accounts.length,
  });
});

app.post("/fee-bump", (req: Request, res: Response) => {
  feeBumpHandler(req, res, config);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fluid server running on http://0.0.0.0:${PORT}`);
  console.log(`Fee payers loaded: ${config.feePayerAccounts.length}`);
  config.feePayerAccounts.forEach((a, i) => {
    console.log(`  [${i + 1}] ${a.publicKey}`);
  });
});