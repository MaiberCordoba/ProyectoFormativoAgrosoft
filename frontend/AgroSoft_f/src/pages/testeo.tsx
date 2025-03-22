import { useDisclosure, addToast } from "@heroui/react";
import ModalGlobal from "@/components/ui/modal";
import ButtonGlobal from "@/components/ui/boton";
import { Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { useState } from "react";

export function Testeo() {
    const { isOpen: isOpenTexto, onOpen: onOpenTexto, onClose: onCloseTexto } = useDisclosure();
    const { isOpen: isOpenFormulario, onOpen: onOpenFormulario, onClose: onCloseFormulario } = useDisclosure();

    // Estados para los inputs
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [pais, setPais] = useState("");
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    const handleSubmit = () => {
        // Validaciones
        if (!nombre || !correo || !password || !pais) {
            addToast({
                title: "Error",
                description: "Todos los campos son obligatorios.",
                variant: "solid", // Cambia el estilo del toast
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        if (!aceptaTerminos) {
            addToast({
                title: "Error",
                description: "Debes aceptar los términos y condiciones.",
                variant: "solid",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        // Si pasa las validaciones, mostrar éxito
        addToast({
            title: "Formulario enviado",
            description: "Los datos se han guardado correctamente.",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
        });

        onCloseFormulario(); // Cierra el modal
    };

    return (
        <div className="flex flex-col gap-4">
            
            {/* Botón para abrir modal con texto simple */}
            <ButtonGlobal onClick={onOpenTexto}>Abrir Modal de Texto</ButtonGlobal>
            <ModalGlobal isOpen={isOpenTexto} onClose={onCloseTexto} title="Información">
                <p className="text-gray-700">Este es un modal con solo texto dentro.</p>
            </ModalGlobal>

            {/* Botón para abrir modal con formulario */}
            <ButtonGlobal onClick={onOpenFormulario}>Abrir Modal con Formulario</ButtonGlobal>
            <ModalGlobal
                isOpen={isOpenFormulario}
                onClose={onCloseFormulario}
                title="Formulario de Registro"
                footerActions={
                    <>
                        <ButtonGlobal color="danger" onClick={onCloseFormulario}>
                            Cancelar
                        </ButtonGlobal>
                        <ButtonGlobal color="primary" onClick={handleSubmit}>
                            Guardar
                        </ButtonGlobal>
                    </>
                }
            >
                <form className="grid grid-cols-2 gap-4">
                    <Input
                        type="text"
                        label="Nombre"
                        labelPlacement="inside"
                        className="w-full"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <Input
                        type="email"
                        label="Correo"
                        labelPlacement="inside"
                        className="w-full"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <Input
                        type="password"
                        label="Contraseña"
                        labelPlacement="inside"
                        className="w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Select label="País" className="w-full" selectedKey={pais} onSelectionChange={setPais}>
                        <SelectItem key="col" value="col">Colombia</SelectItem>
                        <SelectItem key="mex" value="mex">México</SelectItem>
                        <SelectItem key="arg" value="arg">Argentina</SelectItem>
                    </Select>
                    <div className="col-span-2">
                        <Checkbox isSelected={aceptaTerminos} onValueChange={setAceptaTerminos}>
                            Acepto los términos y condiciones
                        </Checkbox>
                    </div>
                </form>
            </ModalGlobal>
        </div>
    );
}
