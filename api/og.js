// /api/og.js
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge", // important for speed
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Untitled Article";
  const image = searchParams.get("image");

  return new ImageResponse(
    (
      <div
        style={{
          background: "#fff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 48,
          fontWeight: 700,
          padding: "40px",
        }}
      >
        {image && (
          <img
            src={image}
            style={{
              width: "100%",
              height: "60%",
              objectFit: "cover",
              borderRadius: 20,
              marginBottom: 30,
            }}
          />
        )}
        <div style={{ color: "#111", textAlign: "center" }}>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
s