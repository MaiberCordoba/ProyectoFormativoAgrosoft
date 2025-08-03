---
title: Finanzas
description: Módulo para gestionar ingresos y gastos relacionados con las actividades agrícolas.
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

El módulo **Finanzas** permite llevar un control detallado de los ingresos y egresos derivados de las actividades agrícolas.  
Ofrece herramientas para registrar, visualizar y analizar los movimientos económicos, facilitando la toma de decisiones informadas sobre la producción y gestión del cultivo.

## 🔹 Funcionalidades principales

1. **Pagos:** Registra y gestiona los pagos asociados a actividades realizadas.
2. **Cosechas:** Documenta la producción obtenida y estima los ingresos generados.
3. **Salarios:** Controla el pago de salarios al personal involucrado en las labores agrícolas.
4. **Resumen Finanzas:** Proporciona un resumen general de ingresos y egresos registrados.
5. **Ventas:** Administra las ventas de productos agrícolas y sus ingresos correspondientes.

<div class="card-grid">
  <a href="/finanzas/pagos" class="card">
    <div class="card-icon"></div>
    <h3>Pagos</h3>
    <p>Registra y gestiona los pagos por actividades agrícolas realizadas.</p>
  </a>

  <a href="/finanzas/cosechas" class="card">
    <div class="card-icon"></div>
    <h3>Cosechas</h3>
    <p>Documenta la producción agrícola y estima los ingresos generados.</p>
  </a>

  <a href="/finanzas/salarios" class="card">
    <div class="card-icon"></div>
    <h3>Salarios</h3>
    <p>Gestiona los pagos de salarios al personal agrícola.</p>
  </a>

  <a href="/finanzas/resumenfinanzas" class="card">
    <div class="card-icon"></div>
    <h3>Resumen Finanzas</h3>
    <p>Consulta un resumen general de todos los ingresos y gastos registrados.</p>
  </a>

  <a href="/finanzas/ventas" class="card">
    <div class="card-icon"></div>
    <h3>Ventas</h3>
    <p>Administra las ventas de productos agrícolas y registra sus ingresos.</p>
  </a>
</div>
