// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'AgroSof',
			social: {
				github: 'https://github.com/MaiberCordoba/ProyectoFormativoAgrosoft',
			},
			sidebar: [
				{
					label: 'Primeros pasos',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Pantalla de ingreso', slug: 'primerospasos/login' },
						{ label: 'Pagina de Inicio', slug: 'primerospasos/home' },
					],
				},
				{
					label: 'Finanzas',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Introduccion Finanzas', slug: 'finanzas/introduccion' },
						{ label: 'Actividades', slug: 'finanzas/actividades' },
						{ label: 'Cosechas', slug: 'finanzas/cosechas' },
						{ label: 'Desechos', slug: 'finanzas/desechos' },
						{ label: 'Herramientas', slug: 'finanzas/herramientas' },
						{ label: 'Tipos Desechos', slug: 'finanzas/tiposdesechos' },
						{ label: 'Usos Herramientas', slug: 'finanzas/usosherramientas' },
						{ label: 'Ventas', slug: 'finanzas/ventas' },
					],
				},
				
			],
		}),
	],
});
