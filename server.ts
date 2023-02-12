import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.177.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.177.0/media_types/mod.ts";
import {refresh } from "./mod.ts";

const refreshMiddleware = refresh();

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // This is how the server works:
  // 1. A request comes in for a specific asset.
  // 2. We read the asset from the file system.
  // 3. We send the asset back to the client.
  console.log("--------------");
  console.log("requesting", pathname);

  const res = refreshMiddleware(request);

  if (res) {
    return res;
  }

  if ([".css", ".js", ".html", ".png", ".svg", ".jpg"].some(ext => pathname.endsWith(ext))) {
    const filepath = join("./public/", pathname);
    let fileContent;

    try {
      fileContent = await Deno.readFile(filepath);
    } catch (e) {
      console.error(e);
      console.error("searching for", filepath)

      if (e instanceof Deno.errors.NotFound) {
        return new Response(null, { status: 404 });
      }
      return new Response(null, { status: 500 });
    }

    const fileExtension = extname(filepath);
    const typeFromExt = contentType(fileExtension);
    console.log("content type", typeFromExt);

    return new Response(fileContent, {
      headers: {
        "content-type": typeFromExt,
      },
    },);
  }

  let indexHtmlContent;

  try {
    indexHtmlContent = await Deno.readFile("public/index.html");
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return new Response("public/index.html does not exist", { status: 404 });
    }
    return new Response(null, { status: 500 });
  }

  return new Response(indexHtmlContent,{
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  },);
}

serve(handleRequest);
