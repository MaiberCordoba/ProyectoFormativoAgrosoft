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
					]
          },
          {
					label: 'Sanidad',
					items:[
						{ label: 'introduccion', slug: 'sanidad/introduccion' },
						{ label: 'Tipo afeccion', slug: 'sanidad/tipoplaga' },
						{ label: 'afecciones', slug: 'sanidad/plagas' },	
						{ label: 'Afecciones en cultivo', slug: 'sanidad/afecciones' },
						{ label: 'Tipo Control', slug: 'sanidad/tipocontrol' },
						{ label: 'Controles', slug: 'sanidad/controles' },
						
						
					
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
