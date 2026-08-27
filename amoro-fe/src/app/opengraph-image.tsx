import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF6EF",
        }}
      >
        <div style={{ fontSize: 120, color: "#DD8A73", fontWeight: 600 }}>
          AMORI
        </div>
        <div style={{ fontSize: 36, color: "#5B4A3F", marginTop: 12 }}>
          made with love
        </div>
      </div>
    ),
    size
  );
}
