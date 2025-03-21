import { ActividadesList } from "../components/listarActividades";
import { Button, Link } from "@heroui/react";

export function Actividades(){
    return(
        <div>
            <Link href="/registro-actividad">
            <Button color="primary" size="sm">
                Registrar Actividad
            </Button>
            </Link>
            
            <ActividadesList/>
        </div>
    )
}