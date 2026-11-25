import { Plugin } from "solana-agent-kit";
import { resumenReservasAction } from "./actions/resumenReservas";

export const reservasPlugin: Plugin = {
  name: "reservas-plugin",
  methods: {},
  actions: [resumenReservasAction],
  initialize: async () => {},
};