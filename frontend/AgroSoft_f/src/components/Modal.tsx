import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";
  
  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footerButtons?: {
      label: string;
      color?: "primary" | "danger" | "secondary" | "success";
      variant?: "light" | "solid";
      onClick?: () => void;
    
    }[];
  }
  
  const ModalComponent = ({ isOpen, onClose, title, children, footerButtons }: ModalProps) => {
    return (
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              {footerButtons?.map((button, index) => (
                <Button key={index} color={button.color || "success"} variant={button.variant} onPress={button.onClick}>
                  {button.label}
                </Button>
              ))}
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ModalComponent;
  