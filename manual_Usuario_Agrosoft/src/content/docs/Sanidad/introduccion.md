---
title: Sanidad
description: Gestión de actividades sanitarias en AgroSoft
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

El módulo **Sanidad** gestiona y supervisa las actividades sanitarias dentro del sistema AgroSoft. Proporciona endpoints para administrar la salud del cultivo, el control de plagas y el uso de productos fitosanitarios.

## 🔹 Flujo de EndPoints
1. **Registrar y gestionar tratamientos sanitarios**: Controla las acciones preventivas y correctivas en los cultivos.
2. **Monitoreo de plagas y enfermedades**: Almacena información sobre incidencias y medidas tomadas.
3. **Control de residuos sanitarios**: Registra y categoriza desechos derivados de tratamientos.
4. **Gestión de herramientas y productos sanitarios**: Control de insumos utilizados en el manejo sanitario.
5. **Registro de aplicaciones de productos**: Seguimiento del uso de productos fitosanitarios.

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
  <a href="/sanidad/afecciones" class="card">
    <div class="card-icon"></div>
    <h3>Afecciones</h3>
    <p>Registra y consulta afecciones detectadas en los cultivos</p>
  </a>
  
  <a href="/sanidad/controles" class="card">
    <div class="card-icon"></div>
    <h3>Controles</h3>
    <p>Administra medidas de control aplicadas en los cultivos</p>
  </a>

  <a href="/sanidad/plagas" class="card">
    <div class="card-icon"></div>
    <h3>Plagas</h3>
    <p>Registra y clasifica plagas detectadas en los cultivos</p>
  </a>

  <a href="/sanidad/productoscontrol" class="card">
    <div class="card-icon"></div>
    <h3>Productos de Control</h3>
    <p>Gestiona los productos utilizados en tratamientos sanitarios</p>
  </a>

  <a href="/sanidad/tipocontrol" class="card">
    <div class="card-icon"></div>
    <h3>Tipos de Control</h3>
    <p>Categoriza y administra los distintos tipos de controles sanitarios</p>
  </a>

  <a href="/sanidad/tipoplaga" class="card">
    <div class="card-icon"></div>
    <h3>Tipos de Plagas</h3>
    <p>Clasifica y describe las plagas que afectan los cultivos</p>
  </a>

  <a href="/sanidad/usoproductoscontrol" class="card">
    <div class="card-icon"></div>
    <h3>Uso de Productos de Control</h3>
    <p>Registra la aplicación de productos en tratamientos sanitarios</p>
  </a>
</div>
