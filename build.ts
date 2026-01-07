import tailwindcss from "bun-plugin-tailwind";

await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./dist",
  sourcemap: "linked",
  minify: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  plugins: [tailwindcss],
});

console.log("Build complete!");
