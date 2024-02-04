# vite-plugin-caddy

> [!WARNING]
> THIS PLUGIN IS HIGHLY EXPERIMENTAL, USE WITH CAUTION

## Usage

```js
// vite.config.js
import { defineConfig } from "vite";
import caddyTls from "vite-plugin-caddy";

const config = defineConfig({
  plugins: [
    caddyTls({
      domains: ["this.is.cool.localhost", "something-else.localhost"],
    })
  ]
});

export default config;
```

Will give this in the terminal, allow you to connect to your app on HTTPS with a self-signed and trusted cert.
```
> vite


🔒 Caddy is running to proxy your traffic on https

🔗 Access your local servers 
🌍 https://this.is.cool.localhost
🌍 https://something-else.localhost

```
 
## License

MIT
