# SimpleFileServer
**A deno server for html/css/js files**

## Usage
If any file in the `public` subdirectory changes, a refresh of the page is triggered.
Therefore the `clientRefresh.js` script must be included.

Run with `deno run --allow-net=:8000 --allow-read --watch server.ts`

## Resources
- [serve static assets](https://deno.com/deploy/docs/serve-static-assets)
- [serve static assets 2](https://medium.com/deno-the-complete-reference/a-beginners-guide-to-building-a-static-file-server-in-deno-a4d12745d233)
- [watch for file changes](https://dev.to/craigmorten/how-to-code-live-browser-refresh-in-deno-309o)
  - [github](https://github.com/cmorten/refresh)
  - [deno land](https://deno.land/x/refresh@1.0.0)
