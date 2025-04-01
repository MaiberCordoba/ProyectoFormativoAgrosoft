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
						{ label: "crear-usuario", slug: "usuarios/crear-usuario" },
						{ label: 'actualizar-usuario', slug: 'usuarios/actualizar-usuario' },
						{ label: 'eliminar-usuario', slug: 'usuarios/eliminar-usuario' },
						{ label: 'obtener-lista-usuarios', slug: 'usuarios/obtener-lista-usuarios' },
						{ label: 'obtener-usuario-autenticado', slug: 'usuarios/obtener-usuario-autenticado' },
						{ label: 'obtener-usuario-por-id', slug: 'usuarios/obtener-usuario-por-id' },
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
