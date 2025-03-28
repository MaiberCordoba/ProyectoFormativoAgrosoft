// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Documentacion AgroSoft',
			social: {
				github: 'https://github.com/MaiberCordoba/ProyectoFormativoAgrosoft',
			},
			sidebar: [
				
				
				{
					label: 'Autenticacion',
					items: [
						{ label: 'introduccion', slug: 'autenticacion/introduccion' },
						{ label: 'obtener token', slug: 'autenticacion/obtener-token' },
						{ label: 'refrescar token', slug: 'autenticacion/refrescar-token' },
					],
				},
				{
					label: 'Manejo de usuarios',
					items:[]
				},
				{
					label: 'Seguimiento cultivos',
					items:[],
				},
				{
					label: 'Sanidad',
					items:[],
				},
				{
					label: 'Sensores IoT',
					items:[],
				},
				{
					label: 'Finanzas',
					items:[
						{ label: 'introduccion', slug: 'finanzas/introduccion' },
						{ label: 'actividades', slug: 'finanzas/actividades' },
						{ label: 'cosechas', slug: 'finanzas/cosechas' },
						{ label: 'desechos', slug: 'finanzas/desechos' },
						{ label: 'herramientas', slug: 'finanzas/herramientas' },
						{ label: 'tipos desechos', slug: 'finanzas/tipos-desechos' },
						{ label: 'usos herramientas', slug: 'finanzas/usos-herramientas' },
						{ label: 'usos productos', slug: 'finanzas/usos-productos' },
						{ label: 'ventas', slug: 'finanzas/ventas' }
					],
				},

			],
		}),
	],
});
