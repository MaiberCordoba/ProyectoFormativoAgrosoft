import { useUsers } from "../hooks/useUsers";

const ListUsers = () => {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar los usuarios</p>;

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.nombre} - {user.apellidos}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;
