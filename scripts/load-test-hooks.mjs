import { register } from "node:module";

const hooks = new URL("./register-next-esm.mjs", import.meta.url);
register(hooks.href, import.meta.url);
