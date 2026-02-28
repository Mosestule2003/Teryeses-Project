import { readFileSync } from 'fs';

const html = readFileSync('/vercel/share/v0-project/temp/portfolio.html', 'utf-8');

// Extract the style block
const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if (styleMatch) {
  console.log("=== STYLES ===");
  console.log(styleMatch[1].substring(0, 5000));
  console.log("...");
}

// Extract the body content structure
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (bodyMatch) {
  const body = bodyMatch[1];
  console.log("\n=== BODY LENGTH ===");
  console.log(body.length);
  console.log("\n=== BODY FIRST 8000 chars ===");
  console.log(body.substring(0, 8000));
  console.log("\n=== BODY 8000-16000 chars ===");
  console.log(body.substring(8000, 16000));
  console.log("\n=== BODY 16000-24000 chars ===");
  console.log(body.substring(16000, 24000));
  console.log("\n=== BODY 24000-32000 chars ===");
  console.log(body.substring(24000, 32000));
  console.log("\n=== BODY 32000-40000 chars ===");
  console.log(body.substring(32000, 40000));
  console.log("\n=== BODY 40000-48000 chars ===");
  console.log(body.substring(40000, 48000));
  console.log("\n=== BODY 48000-end ===");
  console.log(body.substring(48000));
}
