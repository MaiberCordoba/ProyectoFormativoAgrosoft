import { useUsers } from '../hooks/useUsers';

export function UserList() {
    const { data: users, isLoading, error } = useUsers();

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los usuarios</p>;

    // Asegúrate de que `users` esté definido antes de renderizarlo
    if (!users) return <p>No se encontraron usuarios.</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Lista de Usuarios</h1>
            <ul>
                {users.map((user: { id: number; nombre: string; apellidos: string }) => (
                    <li key={user.id}>{user.id} {user.nombre} {user.apellidos}</li>
                ))}
            </ul>
        </div>
    );
}
