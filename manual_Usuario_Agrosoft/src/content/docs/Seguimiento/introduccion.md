---
title: Seguimiento de Cultivos
description: Monitoreo y gestión de cultivos dentro del sistema
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

El módulo **Seguimiento de Cultivos** permite registrar y gestionar la información relacionada con los cultivos dentro del sistema. Proporciona herramientas para monitorear su desarrollo, registrar actividades clave y supervisar cada etapa del proceso agrícola.

### 🔹 Funcionalidades principales
1. **Registro de cultivos**: Permite ingresar nuevos cultivos en el sistema con sus datos clave.
2. **Seguimiento del crecimiento**: Monitorea el estado y evolución de los cultivos.
3. **Gestión de intervenciones**: Registra actividades como riego, fertilización y tratamientos.
4. **Control de lotes y trazabilidad**: Facilita el rastreo detallado de cada cultivo.



<div class="card-grid">

  <a href="/seguimiento/tipos-especie" class="card">
    <div class="card-icon"></div>
    <h3>Tipos de Especie</h3>
    <p>Gestiona las diferentes variedades dentro de cada especie.</p>
  </a>


  <a href="/seguimiento/especies" class="card">
    <div class="card-icon"></div>
    <h3>Especies</h3>
    <p>Registra y clasifica las especies cultivadas.</p>
  </a>

  <a href="/seguimiento/cultivos" class="card">
    <div class="card-icon"></div>
    <h3>Cultivos</h3>
    <p>Consulta y gestiona la información de los cultivos registrados.</p>
  </a>


  <a href="/seguimiento/semilleros" class="card">
    <div class="card-icon"></div>
    <h3>Semilleros</h3>
    <p>Registra y gestiona los semilleros utilizados en la producción.</p>
  </a>

  <a href="/seguimiento/lotes" class="card">
    <div class="card-icon"></div>
    <h3>Lotes</h3>
    <p>Administra la ubicación y segmentación de los cultivos.</p>
  </a>

  <a href="/seguimiento/eras" class="card">
    <div class="card-icon"></div>
    <h3>Eras</h3>
    <p>Administra las eras agrícolas utilizadas en la producción.</p>
  </a>

  <a href="/seguimiento/plantaciones" class="card">
    <div class="card-icon"></div>
    <h3>Plantaciones</h3>
    <p>Supervisa y controla las plantaciones activas.</p>
  </a>
</div>
