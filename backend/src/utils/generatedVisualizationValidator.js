const FORBIDDEN_PATTERNS = [ 
  ["eval", /\beval\s*\(/i],
  ["Function constructor", /\bnew\s+Function\b/i],
  ["network request", /\bfetch\s*\(/i],
  ["XMLHttpRequest", /\bXMLHttpRequest\b/i],
  ["WebSocket", /\bWebSocket\b/i],
  ["WebRTC", /\b(RTCPeerConnection|WebRTC)\b/i],
  ["browser window", /\bwindow\s*[.[]/i],
  ["browser document", /\bdocument\s*[.[]/i],
  ["browser storage", /\b(localStorage|sessionStorage)\s*[.[]/i],
  ["cookies", /\b(document\s*\.\s*cookie|cookieStore)\b/i],
  ["Node process", /\bprocess\s*[.[]/i],
  ["CommonJS require", /\brequire\s*\(/i],
  ["Node child process", /\bchild_process\b/i],
  ["Node filesystem", /\b(fs|node:fs)\s*[.[]/i],
  ["global object", /\bglobalThis\s*[.[]/i],
  ["parent frame", /\b(parent|top)\s*[.[]/i],
  ["script tag", /<\/?script\b/i],
  ["Markdown fence", /```/],
];

const ALLOWED_REACT_IMPORT =
  /^import\s+React\s*,\s*\{\s*useState\s*,\s*useEffect\s*\}\s+from\s+["']react["']\s*;?\s*$/;

export function validateGeneratedVisualization(code) {
  if (typeof code !== "string" || !code.trim())
    return { valid: false, reason: "Gemini returned an empty visualization." };
  if (!/export\s+default\s+function\s+GeneratedVisualization\s*\(/.test(code))
    return {
      valid: false,
      reason:
        "Generated code must export default function GeneratedVisualization().",
    };
  const imports = code.match(/^\s*import\s+[^\n]+$/gm) || [];
  if (imports.some((statement) => !ALLOWED_REACT_IMPORT.test(statement.trim())))
    return {
      valid: false,
      reason:
        "Generated code contains an import other than the permitted React import.",
    };
  const forbidden = FORBIDDEN_PATTERNS.find(([, pattern]) =>
    pattern.test(code),
  );
  if (forbidden)
    return {
      valid: false,
      reason: `Generated code uses a forbidden capability: ${forbidden[0]}.`,
    };
  return { valid: true };
}