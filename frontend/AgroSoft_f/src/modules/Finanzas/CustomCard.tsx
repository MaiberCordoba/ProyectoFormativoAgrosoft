import { Button, Card, CardBody, CardFooter } from "@heroui/react";
import React from "react";

interface CustomCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: JSX.Element;
  data?: Record<string, string | number>;
  footerButtons?: {
    label: string;
    color?: "default" | "primary" | "secondary" | "success" | "danger" | "warning" | "solid";
    size?: "sm" | "md" | "lg";
    onPress: () => void;
  }[];
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  hoverEffect?: boolean;
  isPressable?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export default function CustomCard({
  title,
  subtitle,
  description,
  image,
  icon,
  data = {},
  footerButtons = [],
  backgroundColor = "white",
  borderColor = "green-500",
  textColor = "green-800",
  hoverEffect = true,
  isPressable = false,
  onPress,
  children,
}: CustomCardProps) {
  return (
    <Card
      isPressable={isPressable}
      onPress={onPress}
      className={`
        w-[280px] min-w-[280px] h-auto
        flex flex-col justify-between
        rounded-xl shadow-md ${hoverEffect ? "hover:shadow-lg transition-shadow" : ""}
        bg-${backgroundColor} border border-${borderColor} p-3
      `}
    >
      <CardBody className="flex flex-col items-start text-left gap-2">
        {icon && <div className={`text-4xl text-${textColor}`}>{icon}</div>}
        {image && (
          <img
            src={image}
            alt={title}
            className="w-16 h-16 object-cover rounded-md mx-auto"
          />
        )}
        {title && (
          <h3 className={`font-semibold text-base text-${textColor} bg-green-100 w-full p-2 rounded-md`}>
            {title}
          </h3>
        )}
        {subtitle && <p className={`text-sm text-gray-600 w-full`}>{subtitle}</p>}
        {description && <p className={`text-sm text-gray-600 w-full`}>{description}</p>}
        {Object.entries(data).map(([label, value]) => (
          <p key={label} className="text-sm text-left">
            <strong>{label}</strong>: {value}
          </p>
        ))}
        {children}
      </CardBody>
      {footerButtons.length > 0 && (
        <>
          <div className="w-full border-t border-gray-200 my-2" />
          <CardFooter className="w-full flex flex-wrap gap-2 justify-start">
            {footerButtons.map((btn, i) => (
              <Button
                key={i}
                onPress={btn.onPress}
                className={`
                  px-3 py-1 rounded text-sm
                  bg-${btn.color ?? "primary"}/10
                  text-${btn.color ?? "primary"}
                  border border-${btn.color ?? "primary"}/20
                  hover:bg-${btn.color ?? "primary"}/20
                  transition-colors duration-200
                  ${btn.size === "sm" ? "text-xs" : btn.size === "lg" ? "text-base" : ""}
                `}
                size="sm"
              >
                {btn.label}
              </Button>
            ))}
          </CardFooter>
        </>
      )}
    </Card>
  );
}