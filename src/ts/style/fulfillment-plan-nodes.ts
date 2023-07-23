import { Css } from "cytoscape";
import { svgStr } from "./svg";
import { circle } from "./base-shapes";

export const nodeClasses = [
	"maker",
	"design",
	"designInput",
	"designOutput",
	"supplier",
	"atom",
	"compartment",
] as const;
export type NodeClass = (typeof nodeClasses)[number];

type ElementStyle = {
	w: number;
	h: number;
	shape: Css.NodeShape;
};

const nodeStyleMap = new Map<NodeClass, ElementStyle>()
	.set("maker", { w: 32, h: 32, shape: "barrel" })
	.set("design", { w: 32, h: 32, shape: "ellipse" })
	.set("designInput", { w: 32, h: 32, shape: "ellipse" })
	.set("designOutput", { w: 32, h: 32, shape: "ellipse" })
	.set("supplier", { w: 32, h: 32, shape: "ellipse" })
	.set("atom", { w: 32, h: 32, shape: "ellipse" })

	.set("compartment", { w: 50, h: 50, shape: "barrel" });

export const getNodeClass = (n: cytoscape.NodeSingular): NodeClass => {
	return n.data("class");
};

export const content = (n: cytoscape.NodeSingular): string => {
	return n.data("label");
};

export const dimensions = (nc: NodeClass) => {
	const dim = nodeStyleMap.get(nc);
	if (!dim) {
		throw new TypeError(`${nc} does not have a default width / height`);
	}
	const { w, h } = dim;
	return { w, h };
};

export const shape = (nc: NodeClass): Css.NodeShape => {
	return nodeStyleMap.get(nc)?.shape || "ellipse";
};

export const compartment: Css.Node = {
	"background-width": "100%",
	"background-position-x": "25%",
	"background-position-y": "19px",
	"background-fit": "contain",
	// "background-clip": "clipped",
	"border-width": "4",
	"padding-top": "38px",
	"padding-bottom": "38px",
	"padding-left": "38px",
	"padding-right": "38px",
};

export const maker = compartment;

const atomSvg = (nc: NodeClass): string => {
	const { w, h } = dimensions(nc);

	const centerX = w / 2;
	const centerY = h / 2;
	const outerRadius = (Math.min(w, h) - 2) / 2;
	const innerRadius = (Math.min(w, h) - 2) / 2;

	const styleMap = new Map()
		.set("stroke", "#6A6A6A")
		.set("stroke-width", "2")
		.set("fill", "none");

	const atomSvgStr = `
        ${circle(centerX, centerY, outerRadius, styleMap)}
        ${circle(centerX, centerY, innerRadius, styleMap)}
    `;
	return svgStr(atomSvgStr, w, h);
};

export const atom: Css.Node = {
	"background-opacity": 1,
	"background-image": atomSvg("atom"),
	"background-fit": "none",
	"background-width": "100%",
	"background-height": "100%",
	"background-clip": "none",
	"background-repeat": "no-repeat",
	"border-width": 0,
};

export const makerDesign = atom;
export const designInput = atom;
export const designOutput = atom;
export const supplier = atom;

const nodeShapeMap = new Map<NodeClass, Css.Node>()
	// process nodes
	.set("maker", maker)
	.set("design", makerDesign)
	.set("designInput", designInput)
	.set("designOutput", designOutput)
	.set("supplier", supplier)
	.set("atom", atom)
	.set("compartment", compartment);

export const getNodeCss = (nc: NodeClass): cytoscape.Css.Node => {
	let css = nodeShapeMap.get(nc);
	if (!css) {
		throw new TypeError(`${nc} does not have a shape implementation`);
	}
	return css;
};
