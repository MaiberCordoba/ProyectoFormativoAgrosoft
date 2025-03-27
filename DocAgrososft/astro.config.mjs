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
					items:[
						{ label: 'Tipo Plaga', slug: 'sanidad/tipoplaga' },
						{ label: 'Plagas', slug: 'sanidad/plagas' },
						{ label: 'Afecciones', slug: 'sanidad/afecciones' },
						{ label: 'Tipo Control', slug: 'sanidad/tipocontrol' },
						{ label: 'Controles', slug: 'sanidad/controles' },
						{ label: 'Productos para el Control', slug: 'sanidad/productoscontrol' },
						{ label: 'Uso Productos para el Control', slug: 'sanidad/usoproductoscontrol' },
					],
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
