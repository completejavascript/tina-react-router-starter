import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("hello-world", "./routes/helloWorld.tsx"),
] satisfies RouteConfig;
