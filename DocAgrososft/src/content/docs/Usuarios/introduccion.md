---
title: Gestión de Usuarios
description: Administración de usuarios en AgroSoft API
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

Gestión de usuarios en la API de AgroSoft, permitiendo crear, actualizar, consultar y eliminar usuarios del sistema.

## Funcionalidades Principales
1. **Listar usuarios**: Obtén un listado de los usuarios registrados.
2. **Registrar usuario**: Crea nuevos usuarios en el sistema.
3. **Consultar usuario**: Obtén información detallada de un usuario específico.
4. **Actualizar usuario**: Modifica los datos de un usuario existente.
5. **Eliminar usuario**: Elimina un usuario del sistema.

<div class="card-grid">
  <a href="/usuarios/usuarios" class="card">
    <div class="card-icon"></div>
    <h3>Listar Usuarios</h3>
    <p>Consulta todos los usuarios registrados</p>
  </a>
  
  <a href="/usuarios/usuarios" class="card">
    <div class="card-icon"></div>
    <h3>Registrar Usuario</h3>
    <p>Crea un nuevo usuario en la plataforma</p>
  </a>

  <a href="/usuarios/usuarios" class="card">
    <div class="card-icon"></div>
    <h3>Consultar Usuario</h3>
    <p>Obtén información de un usuario en específico</p>
  </a>

  <a href="/usuarios/usuarios" class="card">
    <div class="card-icon"></div>
    <h3>Actualizar Usuario</h3>
    <p>Modifica los datos de un usuario existente</p>
  </a>

  <a href="/usuarios/usuarios" class="card">
    <div class="card-icon"></div>
    <h3>Eliminar Usuario</h3>
    <p>Borra un usuario del sistema de forma permanente</p>
  </a>
</div>
