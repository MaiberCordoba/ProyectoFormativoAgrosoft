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
					label: 'Sanidad',
					items:[
						{ label: 'introduccion', slug: 'sanidad/introduccion' },
						{ label: 'Afecciones en cultivo', slug: 'sanidad/afecciones' },
						{ label: 'Controles', slug: 'sanidad/controles' },
						{ label: 'afecciones', slug: 'sanidad/plagas' },	
						{ label: 'Productos para el Control', slug: 'sanidad/productoscontrol' },
						{ label: 'Tipo Control', slug: 'sanidad/tipocontrol' },
						{ label: 'Tipo afeccion', slug: 'sanidad/tipoplaga' },
						{ label: 'Uso Productos para el Control', slug: 'sanidad/usoproductoscontrol' },
					],

				},


			],
		}),
	],
});
