---
title: Actividades
description: Gestión y control de las actividades agrícolas realizadas en el sistema.
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

El módulo **Actividades** permite registrar, organizar y clasificar las tareas agrícolas que se realizan dentro del sistema.  
Facilita el control y trazabilidad del trabajo realizado en los cultivos, incluyendo sus unidades de medida y tiempo, optimizando la planificación y seguimiento de labores agrícolas.

## 🔹 Funcionalidades principales

1. **Actividades:** Registro de tareas realizadas en los cultivos.
2. **Tipos de Actividad:** Clasificación de las actividades según su naturaleza.
3. **Unidades de Medida:** Definición de medidas utilizadas para cuantificar actividades (ej. kilogramos, litros).
4. **Unidades de Tiempo:** Establece unidades temporales para medir la duración de las tareas.

<div class="card-grid">
  <a href="/actividades/actividades" class="card">
    <div class="card-icon"></div>
    <h3>Actividades</h3>
    <p>Registra tareas realizadas dentro de los cultivos</p>
  </a>

  <a href="/actividades/tiposactividad" class="card">
    <div class="card-icon"></div>
    <h3>Tipos de Actividad</h3>
    <p>Clasifica las actividades agrícolas por tipo</p>
  </a>

  <a href="/actividades/unidadesmedida" class="card">
    <div class="card-icon"></div>
    <h3>Unidades de Medida</h3>
    <p>Define las medidas aplicables a las actividades</p>
  </a>

  <a href="/actividades/unidadestiempo" class="card">
    <div class="card-icon"></div>
    <h3>Unidades de Tiempo</h3>
    <p>Establece la duración de las tareas agrícolas</p>
  </a>
</div>
