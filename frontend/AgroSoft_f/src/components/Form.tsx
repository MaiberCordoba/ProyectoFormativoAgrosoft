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
}

const FormComponent: React.FC<FormComponentProps> = ({ fields, onSubmit, submitLabel = "Enviar" }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    onSubmit(formData);
  };

  return (
    <Form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
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
      <Button type="submit" variant="bordered">
        {submitLabel}
      </Button>
    </Form>
  );
};

export default FormComponent;
