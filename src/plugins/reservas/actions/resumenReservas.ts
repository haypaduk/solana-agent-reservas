import { Action } from "solana-agent-kit";
import { z } from "zod";
import { resumenReservas } from "../tools/resumenReservas";

export const resumenReservasAction: Action = {
  name: "RESUMEN_RESERVAS",
  similes: ["consultar reservas", "estado del negocio"],
  description: "Obtiene el resumen de espacios y reservas del programa.",
  examples: [],
  schema: z.object({}),
  handler: async (agent: any) => {
    try {
      const data = await resumenReservas(agent);
      return { status: "success", message: "Resumen obtenido", data: data };
    } catch (error: any) {
      return { status: "error", message: "Error al leer", data: error.message };
    }
  },
};