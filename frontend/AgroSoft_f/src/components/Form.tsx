import React from "react";
import { Form, Input, Button } from "@heroui/react";

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
}

interface FormComponentProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  extraContent?: React.ReactNode; // Aquí agregamos la propiedad extraContent
}

const FormComponent: React.FC<FormComponentProps> = ({
  fields,
  onSubmit,
  submitLabel = "Enviar",
  extraContent, // Recibimos el contenido adicional
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    onSubmit(formData);
  };

  return (
    <Form className="w-full max-w-xs flex flex-col gap-4" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <Input
          key={field.name}
          isRequired={field.required}
          errorMessage={field.errorMessage}
          label={field.label}
          labelPlacement="outside"
          name={field.name}
          placeholder={field.placeholder}
          type={field.type || "text"}
        />
      ))}
      
      {/* Espacio para contenido adicional */}
      {extraContent && <div className="mt-4">{extraContent}</div>}

      <Button color="success" size="sm" radius="sm" type="submit" variant="light">
        {submitLabel}
      </Button>
    </Form>
  );
};

export default FormComponent;
