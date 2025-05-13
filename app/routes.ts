import {
  type RouteConfig,
  index,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('use-state', 'routes/component-state.tsx'),
  route('url-params', 'routes/url-searchparams.tsx'),
] satisfies RouteConfig;
