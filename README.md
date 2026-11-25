# Agente de Consulta - Sistema de Reservas Solana

Este proyecto es la entrega del Taller 1 del Advanced Bootcamp de Solana (WayLearn). Consiste en un agente de Inteligencia Artificial que se conecta a la red de Solana (Devnet) para consultar en lenguaje natural el estado de las cuentas de un programa de reservas de espacios.

## 🧠 Arquitectura
El agente utiliza `solana-agent-kit` para estructurar las herramientas y un modelo local (Qwen2.5 7B) ejecutado en LM Studio. 
La herramienta personalizada (`resumenReservas`) lee las cuentas del programa usando Anchor y el IDL, calcula los totales y se los inyecta a la IA como contexto para responder.

## ⚙️ Instalación y Ejecución
1. Clonar el repositorio e instalar dependencias:
   npm install
2. Configurar las variables de entorno en un archivo `.env` (basado en `.env.example`).
3. Iniciar el servidor de LM Studio con el modelo `qwen2.5-7b-instruct` en el puerto correspondiente.
4. Ejecutar el agente:
   npx tsx src/agent.ts

## 🔗 Evidencias de Funcionamiento

### 1. Prueba directa de lectura (Sin IA)
Se ejecutó la función `resumenReservas` de forma aislada para comprobar la lectura de las cuentas en Devnet.
```
$ npx tsx src/prueba.ts
Consultando la blockchain directamente (sin IA)...
{
  "existe": true,
  "total_espacios": 6,
  "total_reservas_activas": 0,
  "suma_precios_espacios": 18000,
  "reservas_detalle": []
}
```

### 2. Consulta con el Agente (IA)
El agente respondió correctamente a las consultas basándose en los datos reales de la blockchain sin inventar información.

Tú: ¿Cuántos espacios tengo en mi negocio?
🤖 Pensando...
Agente: Tienes 6 espacios en tu negocio según la información proporcionada.

Tú: ¿Cuál es la suma de los precios de mis espacios?
🤖 Pensando...
Agente: La suma de los precios de tus espacios es 18000. Sin embargo, esto es la suma para todos los espacios registrados en el sistema y no necesariamente para tus espacios específicos.

### 3. Caso sin registro (Cuenta inexistente)
El agente fue probado con preguntas cuya respuesta no estaba en los datos de la herramienta, demostrando que no inventa información.

Tú: ¿Cuál es mi negocio?
🤖 Pensando...
Agente: No lo sé. Los datos proporcionados no contienen información sobre tu negocio específico.

---
**Nota:** El archivo `.env` se encuentra excluido del repositorio por seguridad (añadido al `.gitignore`). Se incluye un archivo `.env.example` con las variables necesarias.
