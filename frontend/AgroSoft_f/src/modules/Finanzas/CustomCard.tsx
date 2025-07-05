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
        w-[200px] min-w-[200px] h-auto
        flex flex-col justify-between
        rounded-lg shadow-sm ${hoverEffect ? "hover:shadow-md transition-shadow" : ""}
        bg-${backgroundColor} border border-${borderColor} p-2
      `}
    >
      <CardBody className="flex flex-col items-start text-left gap-1">
        {icon && <div className={`text-3xl text-${textColor}`}>{icon}</div>}
        {image && (
          <img
            src={image}
            alt={title}
            className="w-12 h-12 object-cover rounded-md mx-auto"
          />
        )}
        {title && (
          <h3 className={`font-semibold text-sm text-${textColor} bg-green-100 w-full p-1 rounded-md`}>
            {title}
          </h3>
        )}
        {subtitle && <p className={`text-xs text-gray-600 w-full`}>{subtitle}</p>}
        {description && <p className={`text-xs text-gray-600 w-full`}>{description}</p>}
        {Object.entries(data).map(([label, value]) => (
          <p key={label} className="text-xs text-left">
            <span className="font-semibold">{label}</span>: {value}
          </p>
        ))}
        {children}
      </CardBody>
      {footerButtons.length > 0 && (
        <>
          <div className="w-full border-t border-gray-200 my-1" />
          <CardFooter className="w-full flex flex-wrap gap-1 justify-start">
            {footerButtons.map((btn, i) => (
              <Button
                key={i}
                onPress={btn.onPress}
                className={`
                  px-2 py-1 rounded text-xs
                  bg-${btn.color ?? "success"}/10
                  text-${btn.color ?? "success"}
                  border border-${btn.color ?? "success"}/20
                  hover:bg-${btn.color ?? "success"}/20
                  transition-colors duration-200
                  ${btn.size === "sm" ? "text-xs" : btn.size === "lg" ? "text-sm" : ""}
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