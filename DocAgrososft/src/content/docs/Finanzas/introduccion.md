---
title: Finanzas
description: Gestión de actividades económicas y operativas en AgroSoft
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

El módulo **Finanzas** gestiona y registra las actividades económicas y operativas dentro del sistema AgroSoft. Proporciona endpoints para administrar diferentes aspectos de la producción, el uso de recursos y la comercialización de productos.

## 🔹 Flujo de EndPoints
1. **Registrar y gestionar actividades**: Controla las operaciones agrícolas y financieras.
2. **Administrar cosechas**: Almacena información sobre producción y rendimiento.
3. **Control de desechos**: Registra y categoriza residuos generados.
4. **Gestión de herramientas y productos**: Control de insumos y materiales utilizados.
5. **Registro de ventas**: Seguimiento de comercialización de productos.

<div class="card-grid">
  <a href="/finanzas/actividades" class="card">
    <div class="card-icon"></div>
    <h3>Actividades</h3>
    <p>Registra y consulta actividades asignadas</p>
  </a>
  
  <a href="/finanzas/cosechas" class="card">
    <div class="card-icon"></div>
    <h3>Cosechas</h3>
    <p>Administra información sobre producción y rendimiento</p>
  </a>

  <a href="/finanzas/desechos" class="card">
    <div class="card-icon"></div>
    <h3>Desechos</h3>
    <p>Registra y clasifica residuos generados</p>
  </a>

  <a href="/finanzas/herramientas" class="card">
    <div class="card-icon"></div>
    <h3>Herramientas</h3>
    <p>Controla el uso y disponibilidad de herramientas</p>
  </a>

  <a href="/finanzas/tipos-desechos" class="card">
    <div class="card-icon"></div>
    <h3>Tipos de Desechos</h3>
    <p>Categoriza y administra diferentes tipos de residuos</p>
  </a>

  <a href="/finanzas/usos-herramientas" class="card">
    <div class="card-icon"></div>
    <h3>Usos de Herramientas</h3>
    <p>Registra el uso de herramientas en actividades</p>
  </a>

  <a href="/finanzas/usos-productos" class="card">
    <div class="card-icon"></div>
    <h3>Usos de Productos</h3>
    <p>Administra el uso de productos en la producción</p>
  </a>

  <a href="/finanzas/ventas" class="card">
    <div class="card-icon"></div>
    <h3>Ventas</h3>
    <p>Registra y administra tus productos vendidos</p>
  </a>
</div>
