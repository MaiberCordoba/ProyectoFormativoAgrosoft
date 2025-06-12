---
title: Finanzas
description: Seguimiento de ganancias y gastos relacionados con los cultivos en el sistema.
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

El módulo **Finanzas** permite llevar un seguimiento detallado de los ingresos y egresos relacionados con los cultivos dentro del sistema.  
Proporciona herramientas para visualizar y controlar los movimientos económicos derivados de las actividades agrícolas, ayudando en la toma de decisiones eficientes.

## 🔹 Funcionalidades principales

1. **Actividades:** Registra las actividades realizadas en los cultivos que generan gastos o ingresos.
2. **Cosechas:** Documenta la producción obtenida con sus valores estimados de ingreso.
3. **Desechos:** Controla residuos generados y sus costos asociados.
4. **Tipos de Desechos:** Clasifica los desechos agrícolas para análisis más precisos.
5. **Ventas:** Registra y gestiona ventas de productos agrícolas.

<div class="card-grid">
  <a href="/finanzas/actividades" class="card">
    <div class="card-icon"></div>
    <h3>Actividades</h3>
    <p>Registra tareas agrícolas que generan movimientos financieros</p>
  </a>

  <a href="/finanzas/cosechas" class="card">
    <div class="card-icon"></div>
    <h3>Cosechas</h3>
    <p>Documenta cosechas y estima ingresos por producción</p>
  </a>

  <a href="/finanzas/desechos" class="card">
    <div class="card-icon"></div>
    <h3>Desechos</h3>
    <p>Gestiona residuos agrícolas y sus implicaciones económicas</p>
  </a>

  <a href="/finanzas/tiposdesechos" class="card">
    <div class="card-icon"></div>
    <h3>Tipos de Desechos</h3>
    <p>Clasifica residuos agrícolas para análisis más detallados</p>
  </a>

  <a href="/finanzas/ventas" class="card">
    <div class="card-icon"></div>
    <h3>Ventas</h3>
    <p>Gestiona la venta de productos y sus ingresos</p>
  </a>
</div>
