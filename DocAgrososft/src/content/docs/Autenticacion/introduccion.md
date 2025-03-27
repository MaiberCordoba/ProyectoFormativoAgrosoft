---
title: Autenticación
description: Gestión de credenciales y tokens JWT en AgroSoft
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

Control de acceso seguro a la API de AgroSoft mediante tokens JWT.

## Flujo de Autenticación
1. **Iniciar sesión**: Obtén tokens con credenciales válidas
2. **Usar token**: Incluye `access_token` en cabeceras
3. **Renovar token**: Obtén un nuevo `access_token` cuando expire

<div class="card-grid">
  <a href="/autenticacion/obtener-token" class="card">
    <div class="card-icon"></div>
    <h3>Iniciar Sesión</h3>
    <p>Usa correo y contraseña para obtener tokens</p>
  </a>
  
  <a href="/autenticacion/refrescar-token" class="card">
    <div class="card-icon"></div>
    <h3>Renovar Token</h3>
    <p>Obtén un nuevo access token con el refresh token</p>
  </a>
</div>