export interface User {
  id: number;
  identificacion: number;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string; // Puedes usar Date si lo parseas antes de usarlo
  telefono: string;
  correoElectronico: string;
  admin: boolean;
}
