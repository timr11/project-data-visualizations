export type StyleMap = Map<string, string>;

export const styleMap2Str = (styleMap: StyleMap) => {
	if (!styleMap) {
		return "";
	}

	let s = "";

	for (let [k, v] of styleMap) {
		s += k + "=" + '"' + v + '"' + " ";
	}

	return s;
};

const svg = (svgStr: string, width = 100, height = 100) => {
	const parser = new DOMParser();
	let svgText = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg><svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='${width}' height='${height}'>${svgStr}</svg>`;
	return parser.parseFromString(svgText, "text/xml").documentElement;
};

export const svgStr = (
	svgStr: string,
	viewPortWidth: number,
	viewPortHeight: number
) => {
	let s = svg(svgStr, viewPortWidth, viewPortHeight);

	// uri component string
	let data = "data:image/svg+xml;utf8," + encodeURIComponent(s.outerHTML);

	return data;
};
