import { HerramientasList } from "../components/listarHerramientas";
import { Button, Link } from "@heroui/react";

export function Herramientas(){
    return(
        <div>
            <Link href="/registro-herramienta">
            <Button color="primary" size="sm">
                Registrar Herramienta
            </Button>
            </Link>
            
            <HerramientasList/>
        </div>
    )
}