const sockets: Set<WebSocket> = new Set();
const DEFAULT_DEBOUNCE_TIMEOUT = 50;

/**
 * Watch files from current directory
 * and trigger a refresh on change.
 */
async function watch() {
  // Create our file watcher.
  const watcher = Deno.watchFs("./public/");

  // Wait for, and loop over file events.
  for await (const event of watcher) {

    if (["any", "access"].includes(event.kind)){
      continue;
    }

    console.log(event.kind);

    let queued = false;

    function send() {
      queued = false;
      sockets.forEach((s) => {
        try{
          s.send("refresh");
        } catch (e){
          console.error("send:", e);
        }
      });
    }

    if (!queued){
      queued = true;
      setTimeout(send, DEFAULT_DEBOUNCE_TIMEOUT);
    }
  }
}

/**
 * Upgrade a request connection to a WebSocket if
 * the url ends with "/refresh"
 */
function refreshMiddleware(req: Request): Response | null {
  // Only upgrade requests ending with "/refresh".
  if (req.url.endsWith("/_refresh")) {
    // Upgrade the request to a WebSocket.
    const { response, socket } = Deno.upgradeWebSocket(req);

    sockets.add(socket);

    socket.onclose = () => {
      sockets.delete(socket);
    };

    return response;
  }

  // Leave all other requests alone.
  return null;
};

/**
 * Constructs a refresh middleware for reloading
 * the browser on file changes.
 */
export function refresh(): (req: Request) => Response | null {
  watch();

  return refreshMiddleware;
}
