import React, { useState } from "react";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  options?: string;
}

interface FormComponentProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  extraContent?: React.ReactNode;
}

const FormComponent: React.FC<FormComponentProps> = ({
  fields,
  onSubmit,
  extraContent,
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  const handleSelectChange = (name: string, value: boolean) => {
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      {fields.map((field) => {
        if (field.options) {
          const options = [
            { key: "true", label: "True", value: true },
            { key: "false", label: "False", value: false },
          ];

          return (
            <Select
              key={field.name}
              label={field.label}
              name={field.name}
              isRequired={field.required}
              onChange={(e) =>
                handleSelectChange(field.name, e.target.value === "true")
              }
              value={String(formValues[field.name])}
            >
              {options.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          );
        } else if (field.type === "password") {
          return (
            <Input
              size="sm"
              key={field.name}
              isRequired={field.required}
              errorMessage={field.errorMessage}
              label={field.label}
              labelPlacement="inside"
              name={field.name}
              placeholder={field.placeholder}
              type={showPassword[field.name] ? "text" : "password"}
              className="w-full"
              endContent={
                <button
                  type="button"
                  className="text-gray-600 focus:outline-none"
                  onClick={() => togglePasswordVisibility(field.name)}
                >
                  {showPassword[field.name] ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              }
            />
          );
        } else {
          return (
            <Input
              size="sm"
              key={field.name}
              isRequired={field.required}
              errorMessage={field.errorMessage}
              label={field.label}
              labelPlacement="inside"
              name={field.name}
              placeholder={field.placeholder}
              type={field.type || "text"}
              className="w-full"
            />
          );
        }
      })}

      {extraContent && <div className="mt-4">{extraContent}</div>}
    </Form>
  );
};

export default FormComponent;