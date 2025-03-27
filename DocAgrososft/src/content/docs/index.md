---
title: AgroSoft API
description: Plataforma integral de gestión agrícola
---

<style>
  /* Estilos para la página completa */
  .api-banner {
    background: #f0f7e6;
    padding: 1rem;
    border-radius: 8px;
    margin: 1.5rem 0;
    font-family: monospace;
    border: 1px solid #4CAF50;
  }
  
  .modules-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmin(250px, 1fr));
    margin: 2rem 0;
  }
  
  .module-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .module-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-color: #4CAF50;
  }
  
  .quick-links {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .link-button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    background: #4CAF50;
    color: white;
    text-decoration: none;
  }
</style>



#  Bienvenido a AgroSoft API

Solución tecnológica para la gestión inteligente de fincas agrícolas

<!-- Quick Links -->
<div class="quick-links">
  <a href="/autenticacion/introduccion" class="link-button">
     Comenzar con la API
  </a>
  <a href="/guias/quickstart" class="link-button" style="background: transparent; border: 1px solid #e2e8f0; color: inherit;">
     Guía Rápida
  </a>
</div>

##  Módulos Principales

<div class="modules-grid">
  <!-- Tarjeta de usuarios -->
  <a href="/modulos/cultivos" class="module-card">
    <div style="font-size: 2rem; margin-bottom: 1rem;"></div>
    <h3>Usuarios</h3>
    <p>Control de usuarios.</p>
    <small>Ver módulo →</small>
  </a>

<div class="modules-grid">
  <!-- Tarjeta de Cultivos -->
  <a href="/modulos/cultivos" class="module-card">
    <div style="font-size: 2rem; margin-bottom: 1rem;"></div>
    <h3>Cultivos</h3>
    <p>Monitoreo de siembras.</p>
    <small>Ver módulo →</small>
  </a>
  
  <!-- Tarjeta de Sanidad -->
  <a href="/modulos/sanidad" class="module-card">
    <div style="font-size: 2rem; margin-bottom: 1rem;"></div>
    <h3>Sanidad</h3>
    <p>Control de plagas y tratamientos fitosanitarios</p>
    <small>Ver módulo →</small>
  </a>
  
  <!-- Tarjeta de Sensores -->
  <a href="/modulos/iot" class="module-card">
    <div style="font-size: 2rem; margin-bottom: 1rem;"></div>
    <h3>Sensores IoT</h3>
    <p>Datos en tiempo real de tu cultivo</p>
    <small>Ver módulo →</small>
  </a>
  
  <!-- Tarjeta de Finanzas -->
  <a href="/modulos/finanzas" class="module-card">
    <div style="font-size: 2rem; margin-bottom: 1rem;"></div>
    <h3>Finanzas</h3>
    <p>Gestión de costos y reportes económicos</p>
    <small>Ver módulo →</small>
  </a>
</div>

## Primeros Pasos

1. Configura tus credenciales en [Autenticación](/autenticacion)
2. Explora nuestros [endpoints clave](/guias/quickstart)


<div style="background: #f0fdf4; padding: 1rem; border-radius: 8px; border-left: 4px solid #4CAF50; margin: 2rem 0;">
  <strong>¿Necesitas ayuda?</strong> Visita nuestro <a href="#">centro de soporte</a> o únete a la <a href="#">comunidad</a>.
</div>