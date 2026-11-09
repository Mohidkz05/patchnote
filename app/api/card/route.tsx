import { ImageResponse } from "next/og";

// Anyone can call this URL with any text, so cap every input.
// (Session 15 replaces raw query input with saved notes.)
function param(url: URL, key: string, fallback: string, max: number) {
  return (url.searchParams.get(key) ?? fallback).slice(0, max);
}

export function GET(req: Request) {
  const url = new URL(req.url);
  const title = param(url, "title", "Patchnote", 80);
  const version = param(url, "version", "v0.1.0", 20);
  const date = param(
    url,
    "date",
    new Date().toISOString().slice(0, 10),
    20,
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#10201b",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#8fd4b8" }}>
          Patchnote
        </div>
        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 32, color: "#b8c9c2" }}>
          <span>{version}</span>
          <span>·</span>
          <span>{date}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, s-maxage=86400",
      },
    },
  );
}
