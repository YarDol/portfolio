import { ImageResponse } from "next/og";
import { siteConfig } from "@/shared/config";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 32, color: "#888888" }}>
          {siteConfig.role}
        </div>
        <div style={{ fontSize: 22, color: "#555555", marginTop: 8 }}>
          {siteConfig.location}
        </div>
      </div>
    ),
    { ...size }
  );
}
