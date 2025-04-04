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
					label: 'Cultivos',
					items: [
						{ label: 'Introduccion', slug: 'seguimiento/introduccion' },
						{ label: 'Semilleros', slug: 'seguimiento/semilleros' },
						{ label: 'Cultivos', slug: 'seguimiento/cultivos' },
						{ label: 'Lotes', slug: 'seguimiento/lotes' },
						{ label: 'Eras', slug: 'seguimiento/eras' },
						{ label: 'Especies', slug: 'seguimiento/especies' },
						{ label: 'Tipos Especie', slug: 'seguimiento/tipos-especie' },
						{ label: 'Plantaciones', slug: 'seguimiento/plantaciones' },
				  	],
				  },
        	{
					label: 'IoT',
					items:[
						{ label: 'introduccion', slug: 'iot/introduccion' },
						{ label: 'sensores', slug: 'iot/sensores' },
           },
			],
		}),
	],
});
