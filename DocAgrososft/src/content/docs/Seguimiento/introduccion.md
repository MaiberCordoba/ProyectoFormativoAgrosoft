---
title: Cultivos
description: Gestión de trazabilidad de cultivos en AgroSoft
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

El módulo *Cultivos* permite la gestión y trazabilidad de las actividades agrícolas dentro del sistema AgroSoft. Proporciona endpoints para administrar la información relacionada con cultivos, eras, especies, tipos de especie, plantaciones, lotes y semilleros.

## 🔹 Flujo de EndPoints
1. *Registro y gestión de cultivos*: Administra los cultivos en distintas eras y lotes.
2. *Seguimiento de especies y tipos de especie*: Controla las variedades cultivadas y su trazabilidad.
3. *Gestión de plantaciones y semilleros*: Supervisa la producción desde la siembra hasta la cosecha.
4. *Control de lotes y trazabilidad*: Permite el rastreo detallado de los productos agrícolas.

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
| access_token   | string | Token de acceso generado previamente      | ✅         |
| Content-Type   | string | Tipo de contenido: application/json     | ✅         |
| Accept        | string | Tipo de respuesta: application/json      | ✅         |

<div class="card-grid">
  <a href="/seguimiento/cultivo" class="card">
    <div class="card-icon"></div>
    <h3>Cultivos</h3>
    <p>Registra y gestiona los cultivos en el sistema</p>
  </a>
  
  <a href="/seguimiento/eras" class="card">
    <div class="card-icon"></div>
    <h3>Eras</h3>
    <p>Administra las eras agrícolas utilizadas en la producción</p>
  </a>

  <a href="/seguimiento/especies" class="card">
    <div class="card-icon"></div>
    <h3>Especies</h3>
    <p>Registra y clasifica las especies cultivadas</p>
  </a>

  <a href="/seguimiento/tiposespecie" class="card">
    <div class="card-icon"></div>
    <h3>Tipos de Especie</h3>
    <p>Gestiona las diferentes variedades dentro de cada especie</p>
  </a>

  <a href="/seguimiento/plantaciones" class="card">
    <div class="card-icon"></div>
    <h3>Plantaciones</h3>
    <p>Supervisa y controla las plantaciones activas</p>
  </a>

  <a href="/seguimiento/lotes" class="card">
    <div class="card-icon"></div>
    <h3>Lotes</h3>
    <p>Administra la segmentación de los cultivos en lotes</p>
  </a>

  <a href="/seguimiento/semillero" class="card">
    <div class="card-icon"></div>
    <h3>Semillero</h3>
    <p>Registra y gestiona los semilleros utilizados en la producción</p>
  </a>
</div>
