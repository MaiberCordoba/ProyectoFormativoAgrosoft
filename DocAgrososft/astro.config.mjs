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
					items:[
						{ label: 'introduccion', slug: 'autenticacion/introduccion' },
					]
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
					items:[
						{ label: 'introduccion', slug: 'sensores/introduccion' },
						{ label: 'acciones', slug: 'sensores/acciones' }
					],
				},
				{
					label: 'Finanzas',
					items:[],
				},

			],
		}),
	],
});
