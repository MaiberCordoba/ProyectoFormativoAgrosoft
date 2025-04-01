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
					items:[
						{ label: 'introduccion', slug: 'seguimiento/introduccion' },
						{ label: 'semillero', slug: 'seguimiento/semillero' },
						{ label: 'cultivo', slug: 'seguimiento/cultivo' },
						{ label: 'lotes', slug: 'seguimiento/lotes' },
						{ label: 'eras', slug: 'seguimiento/eras' },
						{ label: 'especies', slug: 'seguimiento/especies' },
						{ label: 'tiposespecie', slug: 'seguimiento/tiposespecie' },
						{ label: 'plantaciones', slug: 'seguimiento/plantaciones' }
					],
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
					items:[],
				},

			],
		}),
	],
});
