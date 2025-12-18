import { readdirSync, readFileSync, statSync } from "fs";


export const MIMIFY = true;

export let css = "";

function readAllCSS(dir: string) {
	const filesOrFolders = readdirSync(dir);

	for (const item of filesOrFolders) {
		const path = `${dir}/${item}`;
		const stats = statSync(path);

		if (item === "dist")
			continue;

		if (stats.isDirectory()) {
			readAllCSS(path);
			continue;
		}

		if (stats.isFile() && item.endsWith(".css"))
			css += readFileSync(path, "utf8") + "\n";
	}
}
readAllCSS("./src");

if (MIMIFY)
	css = css
		.replaceAll(/[\n\r]|\/\*.+\*\//g, "")
		.replaceAll(/\s+/g, " ")
		.replaceAll(/ ?{ ?/g, "{")
		.replaceAll(/ ?: ?/g, ":")
		.replaceAll(/ ?; ?/g, ";")
		.replaceAll(/;\}/g, "}")
		.replaceAll(/ *\/ */g, "/")
		.replaceAll(", ", ",");

else
	css = css.replaceAll(/\r/g, "");