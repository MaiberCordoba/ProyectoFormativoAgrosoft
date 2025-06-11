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
						{ label: 'Pantalla de ingreso', slug: 'primerospasos/login' },
						{ label: 'Pagina de Inicio', slug: 'primerospasos/home' },
					],
				},
				{
					label: 'Cultivos',
					items: [
						{ label: 'Introduccion', slug: 'seguimiento/introduccion' },
						{ label: 'Tipos Especie', slug: 'seguimiento/tipos-especie' },
						{ label: 'Especies', slug: 'seguimiento/especies' },
						{ label: 'Cultivos', slug: 'seguimiento/cultivos' },
						{ label: 'Semilleros', slug: 'seguimiento/semilleros' },
						{ label: 'Lotes', slug: 'seguimiento/lotes' },
						{ label: 'Eras', slug: 'seguimiento/eras' },
						{ label: 'Plantaciones', slug: 'seguimiento/plantaciones' },
					],
				},
				{
					label: 'IoT',
					items: [
						{ label: 'introduccion', slug: 'iot/introduccion' },
						{ label: 'sensores', slug: 'iot/sensores' },
					],
				},
				{
					label: 'Sanidad',
					items: [
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
						{ label: 'Introduccion Finanzas', slug: 'finanzas/introduccion' },
						{ label: 'Actividades', slug: 'finanzas/actividades' },
						{ label: 'Cosechas', slug: 'finanzas/cosechas' },
						{ label: 'Desechos', slug: 'finanzas/desechos' },
						{ label: 'Tipos Desechos', slug: 'finanzas/tiposdesechos' },
						{ label: 'Ventas', slug: 'finanzas/ventas' },
					],
				},
				{
					label: 'Inventario',
					items: [
						{ label: 'Introducción', slug: 'inventario/introduccion' },
						{ label: 'Bodega', slug: 'inventario/bodega' },
						{ label: 'Herramientas', slug: 'inventario/herramientas' },
						{ label: 'Insumos', slug: 'inventario/insumos' },
						{ label: 'Uso de insumos', slug: 'inventario/usoinsumos' },
						{ label: 'Uso de herramientas', slug: 'inventario/usoherramientas' },
					],
				},
			],
		}),
	],
});
