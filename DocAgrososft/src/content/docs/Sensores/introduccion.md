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

  /* Estilos para la nota */
  .nota {
    background-color: #131a4c;
    color: white;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid #4263eb;
    max-width: 800px;
    margin-top: 1.5rem;
    
  }
  
  .icon {
    margin-right: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }

  strong {
    font-weight: bold;
  }
</style>

Sistema de monitoreo en tiempo real para sensores ambientales y agrícolas, permitiendo la recopilación, visualización y gestión eficiente de datos.

#### Flujo de Datos en Tiempo Real
1. **Captura de datos**: Sensores de temperatura, humedad y otros parámetros transmiten información en tiempo real.
2. **Comunicación WebSocket**: Los datos se envían a través de WebSocket para una actualización instantánea.
3. **Almacenamiento y Alertas**: Se procesan los valores, se almacenan y se generan alertas en caso de valores críticos.
  :::note
    Es necesario incluir un <code>access_token</code> válido al enviar solicitudes a cualquier EndPoint. 
    Para aprender cómo generar el token, utilice el endpoint de autenticación: 
    <a href="/autenticacion/obtener-token">Auth Endpoint</a>. <br /><strong>Importante:</strong> 
    El token de acceso tiene una duración de <strong>1 hora</strong>.
  :::

#### Configuración de la Solicitud
##### Parámetros necesarios para realizar una solicitud a la API

| Parámetro         | Tipo    | Descripción                                | Requerido |
|------------------|--------|--------------------------------------------|-----------|
| `access_token`   | string | Token de acceso generado previamente      | ✅         |
| `Content-Type`   | string | Tipo de contenido: `application/json`     | ✅         |
| `Accept`        | string | Tipo de respuesta: `application/json`      | ✅         |

<div class="card-grid">
  <a href="/sensores/acciones" class="card">
    <div class="card-icon">📲</div>
    <h3>Acciones</h3>
    <p>EndPoint que puedes utilizar</p>
  </a>

  <a href="/sensores/websocket" class="card">
    <div class="card-icon">📡</div>
    <h3>Web Socket</h3>
    <p>Datos en tiempo real</p>
  </a>
</div>
