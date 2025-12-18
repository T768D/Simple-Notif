import { writeFileSync } from "fs";
import { css, MIMIFY } from "./mimify.mjs";

const compiledContents = (await (await Bun.build({
	entrypoints: ["./src/main.mts"],
	outdir: "./dist",
	env: "disable",
	target: "browser",
	format: "esm",
	sourcemap: "none",
	minify: {
		whitespace: MIMIFY,
		identifiers: true,
		syntax: true
	}
})).outputs[0]
	.text())
	.trim();


const realCSS = `const jg=document.createElement("style");jg.innerText="${css}";document.body.appendChild(jg);`;

writeFileSync("./dist/main.js", realCSS + compiledContents, "utf8");