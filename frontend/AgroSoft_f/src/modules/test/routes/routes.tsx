import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const ListUsers = lazy(() => import("../pages/ListUsers"));

export const userRoutes: RouteObject[] = [
  { path: "usuarios", element: <ListUsers /> },
];
