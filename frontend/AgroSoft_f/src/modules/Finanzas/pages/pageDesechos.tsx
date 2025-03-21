import { DesechosList } from "../components/listarDesechos";
import { Button, Link } from "@heroui/react";

export function Desechos(){
    return(
        <div>
            <Link href="/registro-desecho">
            <Button color="primary" size="sm">
                Registrar desecho
            </Button>
            </Link>
            
            <DesechosList/>
        </div>
    )
}