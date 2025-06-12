---
title: Inventario
description: Gestión de recursos físicos y consumibles en AgroSoft
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

El módulo **Inventario** permite gestionar los recursos físicos y consumibles utilizados en las actividades agrícolas. Incluye la administración de bodegas, insumos, herramientas y el registro de su uso, lo que garantiza trazabilidad, control y disponibilidad de los elementos necesarios para la operación diaria.

## 🔹 Flujo de EndPoints
1. **Bodega**: Registra los espacios físicos donde se almacenan herramientas e insumos.
2. **Insumos**: Permite dar de alta, editar y clasificar fertilizantes, productos químicos, semillas, etc.
3. **Herramientas**: Administra el inventario de herramientas agrícolas y su disponibilidad.
4. **Usos de herramientas**: Controla el historial de utilización de herramientas por usuario y actividad.
5. **Usos de insumos**: Registra la aplicación de insumos con fecha, responsable y cantidad usada.

<div class="card-grid">
  <a href="/inventario/bodega" class="card">
    <div class="card-icon"></div>
    <h3>Bodega</h3>
    <p>Gestiona las ubicaciones de almacenamiento de herramientas e insumos</p>
  </a>

  <a href="/inventario/insumos" class="card">
    <div class="card-icon"></div>
    <h3>Insumos</h3>
    <p>Registra y controla productos como fertilizantes y químicos</p>
  </a>

  <a href="/inventario/herramientas" class="card">
    <div class="card-icon"></div>
    <h3>Herramientas</h3>
    <p>Administra herramientas disponibles y su estado</p>
  </a>

  <a href="/inventario/usoherramientas" class="card">
    <div class="card-icon"></div>
    <h3>Uso de Herramientas</h3>
    <p>Registra cuándo y por quién se utilizan las herramientas</p>
  </a>

  <a href="/inventario/usoinsumos" class="card">
    <div class="card-icon"></div>
    <h3>Uso de Insumos</h3>
    <p>Controla la aplicación de insumos en actividades agrícolas</p>
  </a>
</div>
