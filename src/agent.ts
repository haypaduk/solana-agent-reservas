import "dotenv/config";
import { SolanaAgentKit, KeypairWallet } from "solana-agent-kit";
import { Keypair } from "@solana/web3.js";
import { reservasPlugin } from "./plugins/reservas";
import * as readline from "readline";
import { resumenReservas } from "./plugins/reservas/tools/resumenReservas";

async function main() {
  console.log("🤖 Iniciando Agente de Reservas...");

  const wallet = new KeypairWallet(Keypair.generate(), process.env.RPC_URL!);
  const agente: any = new SolanaAgentKit(wallet, process.env.RPC_URL!, {});
  agente.use(reservasPlugin);

  // --- TRUCO: Despertar el modelo ---
  console.log("⏳ Despertando el modelo de IA (esto puede tardar)...");
  try {
    const response = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL,
        messages: [{ role: "user", content: "Hola" }],
        max_tokens: 1 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ LM Studio devolvió un error al despertar: ${response.status} - ${errorText}`);
    } else {
      console.log("✅ Modelo despierto y listo.");
    }
  } catch (e: any) {
    console.log(`\n⚠️ No se pudo conectar con LM Studio: ${e.message}. Asegúrate de que el servidor esté encendido.`);
  }
  // ----------------------------------

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n✅ Agente listo. Haz preguntas sobre tus reservas. Escribe 'salir' para terminar.\n");

  const preguntar = () => {
    rl.question("Tú: ", async (pregunta) => {
      if (pregunta.toLowerCase() === "salir") {
        rl.close();
        return;
      }

      try {
        process.stdout.write("🤖 Pensando... ");

        const datosNegocio = await resumenReservas(agente);

        const systemPrompt = `Eres un asistente útil. Tienes acceso a los siguientes datos reales de la blockchain: ${JSON.stringify(datosNegocio)}. 
Responde a la pregunta del usuario basándote ÚNICAMENTE en estos datos. Si la información no está en los datos, di que no lo sabes.`;

        const response = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
          },
          body: JSON.stringify({
            model: process.env.LLM_MODEL,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: pregunta }
            ],
            temperature: 0.1
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`LM Studio respondió con error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
          console.log(`\nAgente: ${data.choices[0].message.content}\n`);
        } else {
          console.log("\n⚠️ Respuesta inesperada de LM Studio:", JSON.stringify(data, null, 2));
        }

      } catch (error: any) {
        console.error("\n❌ Error:", error.message || error);
      }
      
      preguntar();
    });
  };
  preguntar();
}

main();