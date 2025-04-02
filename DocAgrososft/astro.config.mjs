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
					items: [
						{ label: 'introduccion', slug: 'usuarios/introduccion' },
						{ label: "usuarios", slug: "usuarios/usuarios" }
					]
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
					items:[
						{ label: 'introduccion', slug: 'sanidad/introduccion' },
						{ label: 'Afecciones', slug: 'sanidad/afecciones' },
						{ label: 'Controles', slug: 'sanidad/controles' },
						{ label: 'Plagas', slug: 'sanidad/plagas' },	
						{ label: 'Productos para el Control', slug: 'sanidad/productoscontrol' },
						{ label: 'Tipo Control', slug: 'sanidad/tipocontrol' },
						{ label: 'Tipo Plaga', slug: 'sanidad/tipoplaga' },
						{ label: 'Uso Productos para el Control', slug: 'sanidad/usoproductoscontrol' },
					],
				},
				{
					label: 'Sensores IoT',
					items:[
						{ label: 'introduccion', slug: 'sensores/introduccion' },
						{ label: 'acciones', slug: 'sensores/acciones' },
						{ label: 'webSocket', slug: 'sensores/websocket' },
					],
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
