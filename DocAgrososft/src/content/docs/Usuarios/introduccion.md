---
title: Gestión de Usuarios
description: Administración de usuarios en AgroSoft
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

Administración de usuarios en AgroSoft, incluyendo registro, actualización, eliminación y autenticación.

## Funcionalidades Principales
1. **Registrar usuarios**: Crea nuevos usuarios en el sistema.
2. **Consultar usuarios**: Obtiene información detallada de los usuarios.
3. **Obtener usuario autenticado**: Consulta los datos del usuario con sesión activa.
4. **Obtener usuario por ID**: Busca un usuario específico por su identificador único.
5. **Actualizar usuarios**: Modifica datos de un usuario existente.
6. **Eliminar usuarios**: Remueve un usuario del sistema.

<div class="card-grid">
  <a href="/usuarios/crear-usuario" class="card">
    <div class="card-icon"></div>
    <h3>Crear Usuario</h3>
    <p>Registrar un nuevo usuario en el sistema</p>
  </a>

  <a href="/usuarios/obtener-lista-usuarios" class="card">
    <div class="card-icon"></div>
    <h3>Listar Usuarios</h3>
    <p>Obtener información de los usuarios registrados</p>
  </a>

  <a href="/usuarios/obtener-usuario-autenticado" class="card">
    <div class="card-icon"></div>
    <h3>Obtener Usuario Autenticado</h3>
    <p>Consultar los datos del usuario actualmente autenticado</p>
  </a>

  <a href="/usuarios/obtener-usuario-por-id" class="card">
    <div class="card-icon"></div>
    <h3>Obtener Usuario por ID</h3>
    <p>Consultar un usuario específico por su ID</p>
  </a>

  <a href="/usuarios/actualizar-usuario" class="card">
    <div class="card-icon"></div>
    <h3>Actualizar Usuario</h3>
    <p>Modificar los datos de un usuario existente</p>
  </a>

  <a href="/usuarios/eliminar-usuario" class="card">
    <div class="card-icon"></div>
    <h3>Eliminar Usuario</h3>
    <p>Remover un usuario del sistema</p>
  </a>
</div>
