import { RouteObject } from "react-router-dom";
import ListUsers from "../pages/ListUsers";

export const userRoutes: RouteObject[] = [
  {
    path: "/usuarios",
    element: <ListUsers />,
  },
];
