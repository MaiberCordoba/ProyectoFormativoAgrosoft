import { CosechasList } from "../components/listarCosechas";
import { Button, Link } from "@heroui/react";

export function Cosechas(){
    return(
        <div>
            <Link href="/registro-cosecha">
            <Button color="primary" size="sm">
                Registrar Cosecha
            </Button>
            </Link>
            <CosechasList/>
        </div>
    )
}