---
title: Sensores
description: Gestión y monitoreo en tiempo real de sensores ambientales y agrícolas.
---

<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }
  .card {
    border: 1px solid var(--sl-color-gray-4);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  .card h3 {
    margin-top: 0.5rem;
  }
  .card-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
</style>

Sistema de monitoreo en tiempo real para sensores ambientales y agrícolas, permitiendo la recopilación, visualización y gestión eficiente de datos.

## Flujo de Datos en Tiempo Real
1. **Captura de datos**: Sensores de temperatura, humedad, y otros parámetros transmiten información en tiempo real.
2. **Comunicación WebSocket**: Los datos se envían a través de WebSocket para una actualización instantánea.
3. **Almacenamiento y Alertas**: Se procesan los valores, se almacenan y se generan alertas en caso de valores críticos.

<div class="card-grid">
  <a href="/sensores/acciones" class="card">
    <div class="card-icon">📲</div>
    <h3>Acciones</h3>
    <p>EndPoint que puedes utilizar</p>
  </a>
</div>
