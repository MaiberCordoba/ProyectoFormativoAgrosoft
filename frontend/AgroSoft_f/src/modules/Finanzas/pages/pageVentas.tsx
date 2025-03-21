import { VentasList } from "../components/listarVentas";
import { Button, Link } from "@heroui/react";

export function Ventas(){
    return(
        <div>
            <Link href="/registro-venta">
            <Button color="primary" size="sm">
                Registrar Venta
            </Button>
            </Link>
            
            <VentasList/>
        </div>
    )
}