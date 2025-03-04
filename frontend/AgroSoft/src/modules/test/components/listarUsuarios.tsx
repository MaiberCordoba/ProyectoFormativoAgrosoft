import {useFetchUsers} from '../hooks/useFetchUsers'

export function UserList() {
    const { data: users, isLoading, error } = useFetchUsers();
  
    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los usuarios</p>;
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Lista de Usuarios</h1>
        <ul>
          {users.map((user: { id: number; nombre: string; apellidos: string }) => ( // Asegúrate de usar los nombres correctos
              <li key={user.id}>{user.id} {user.nombre} {user.apellidos}</li>
          ))}
        </ul>
      </div>
    );
  }