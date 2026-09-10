# React + Vite

## API Configuration

API requests use the shared client in `src/api.js`. Set `VITE_API_BASE_URL` in a local `.env` file to change the backend base URL:

```env
VITE_API_BASE_URL=https://example.com/clientportal
```

The default is `/clientportal`, which is proxied to `http://localhost/clientportal` by Vite during development to avoid browser CORS errors. Set `VITE_API_BASE_URL` to an absolute URL when the frontend and API are deployed on different origins; that API must allow the frontend origin and credentials. Use the generic methods from `src/api.js`; they return parsed JSON and throw for non-success HTTP responses:

```js
const result = await get("/campaign/get_detail/123");
const loginResult = await post("/auth/login", { username, password });
const uploadResult = await post("/leads/upload", formData);
```

Available methods are `get`, `post`, `put`, `patch`, and `del`. Pass endpoint paths without the base URL or a page parameter.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
