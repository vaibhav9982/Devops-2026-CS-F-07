import { useEffect, useMemo, useRef, useState } from "react";

const RUNTIME_ERROR = "Generated visualization could not be rendered.";

function buildPreviewDocument(source) {
  // The backend rejects script tags, so this replacement is defence in depth before
  // source is placed in a script element inside the sandboxed, opaque-origin frame.
  const component = source
    .replace(
      /^\s*import\s+React\s*,\s*\{\s*useState\s*,\s*useEffect\s*\}\s+from\s+["']react["']\s*;?\s*$/gm,
      "",
    )
    .replace(
      /export\s+default\s+function\s+GeneratedVisualization/,
      "function GeneratedVisualization",
    )
    .replace(/<\/script/gi, "<\\/script");

  return `<!doctype html><html><head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; font-src 'none'; frame-src 'none';">
    <style>html,body,#root{margin:0;min-height:100%;font-family:Inter,system-ui,sans-serif}body{padding:12px;box-sizing:border-box}</style>
    </head><body><div id="root"></div>
    <script>window.addEventListener('error', function (event) { window.parent.postMessage({ channel: 'code-visualizer-preview', type: 'error', message: event.message || 'Runtime error' }, '*'); });</script>
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone@7.26.10/babel.min.js"></script>
    <script type="text/babel">const { useState, useEffect } = React; ${component}
      try { ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(GeneratedVisualization)); }
      catch (error) { window.parent.postMessage({ channel: 'code-visualizer-preview', type: 'error', message: error.message || 'Render error' }, '*'); }
    </script></body></html>`;
}

export default function GeneratedVisualizationPreview({ code }) {
  const frameRef = useRef(null);
  const [error, setError] = useState("");
  const srcDoc = useMemo(
    () => (code ? buildPreviewDocument(code) : ""),
    [code],
  );

  useEffect(() => {
    const receiveMessage = (event) => {
      if (
        event.source === frameRef.current?.contentWindow &&
        event.data?.channel === "code-visualizer-preview" &&
        event.data.type === "error"
      )
        setError(event.data.message || RUNTIME_ERROR);
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [srcDoc]);

  if (!code)
    return (
      <div className="m-4 flex flex-col gap-1 rounded-[10px] border border-[rgba(255,105,135,.4)] bg-[#4b1525] p-3 text-[#ffc7d1]">
        {RUNTIME_ERROR}
      </div>
    );
  return (
    <section
      className="min-h-[340px] overflow-hidden rounded-[18px] border border-[rgba(151,156,255,.2)] bg-white shadow-[0_20px_45px_rgba(0,0,0,.22)]"
      aria-label="Isolated generated visualization"
    >
      {error && (
        <div className="m-4 flex flex-col gap-1 rounded-[10px] border border-[rgba(255,105,135,.4)] bg-[#4b1525] p-3 text-[#ffc7d1]">
          <strong>{RUNTIME_ERROR}</strong>
          <span>{error}</span>
        </div>
      )}
      <iframe
        className="block min-h-[500px] w-full border-0 bg-white"
        ref={frameRef}
        title="Generated visualization preview"
        sandbox="allow-scripts"
        srcDoc={srcDoc}
      />
    </section>
  );
}
