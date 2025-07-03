import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps, 
} from "@heroui/react";
import { ReactNode } from "react";

interface FooterButton {
  label: string;
  color?: "primary" | "danger" | "secondary" | "success";
  variant?: "light" | "solid";
  onClick?: () => void;
}

interface ModalGlobalProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; 
  children: ReactNode;
  footerButtons?: FooterButton[]; 
}

const ModalGlobal = ({
  isOpen,
  onClose,
  title,
  children,
  footerButtons,
  ...props 
}: ModalGlobalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} {...props}>
    
      <ModalContent className="flex flex-col">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              {title}
            </ModalHeader>

          
            <ModalBody className="overflow-y-auto max-h-[60vh]">
              <div className="px-5 space-y-4">{children}</div>
            </ModalBody>

            <ModalFooter>
              {footerButtons?.map((button, index) => (
                <Button
                  key={index}
                  color={button.color || "success"}
                  variant={button.variant}
                  onPress={button.onClick}
                >
                  {button.label}
                </Button>
              ))}

              <Button color="danger" variant="solid" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalGlobal;