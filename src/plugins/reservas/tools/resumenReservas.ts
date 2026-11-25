import { SolanaAgentKit } from "solana-agent-kit";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import idl from "../../../idl/reservas_espacios.json";

export async function resumenReservas(agente: SolanaAgentKit) {
  try {
    const programId = new PublicKey("DCBhMVdZLirSQ1LtubUPDJHpMzm25naVrHMdngx5upxu");
    
    const provider = new anchor.AnchorProvider(
      agente.connection,
      {} as any,
      { commitment: "confirmed" }
    );
    
    const program = new anchor.Program(idl as any, programId, provider);

    const espacios: any[] = await program.account.espacio.all();
    const reservas: any[] = await program.account.reserva.all();

    let totalEspacios = espacios.length;
    let totalReservasActivas = 0;
    let montoTotalPrecios = 0;

    const reservasMapeadas = reservas.map((r: any) => {
      const estado = Object.keys(r.account.estado)[0]; 
      if (estado === "activa") {
        totalReservasActivas++;
      }
      return {
        espacio: r.account.espacio.toBase58(),
        usuario: r.account.usuario.toBase58(),
        inicio: r.account.inicio.toString(),
        fin: r.account.fin.toString(),
        estado: estado
      };
    });

    espacios.forEach((e: any) => {
      montoTotalPrecios += e.account.precioPorHora.toNumber();
    });

    return {
      existe: true,
      total_espacios: totalEspacios,
      total_reservas_activas: totalReservasActivas,
      suma_precios_espacios: montoTotalPrecios,
      reservas_detalle: reservasMapeadas
    };
  } catch (error) {
    console.error("Error al leer las cuentas:", error);
    return { existe: false, motivo: "No se pudieron leer las cuentas" };
  }
}