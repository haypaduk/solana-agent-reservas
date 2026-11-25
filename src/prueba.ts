import "dotenv/config";
import { Keypair } from "@solana/web3.js";
import { SolanaAgentKit, KeypairWallet } from "solana-agent-kit";
import { resumenReservas } from "./plugins/reservas/tools/resumenReservas";

async function main() {
  const wallet = new KeypairWallet(Keypair.generate(), process.env.RPC_URL!);
  const agente = new SolanaAgentKit(wallet, process.env.RPC_URL!, {});

  console.log("Consultando la blockchain directamente (sin IA)...");
  const resultado = await resumenReservas(agente);
  
  console.log(JSON.stringify(resultado, null, 2));
}

main();