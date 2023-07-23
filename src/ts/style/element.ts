import cytoscape, { Css } from "cytoscape";

type ElementStyle = {
	w: number;
	h: number;
	shape: Css.NodeShape;
};

const elementStyleMap = new Map<string, ElementStyle>()
	.set("maker", { w: 32, h: 32, shape: "ellipse" })
	.set("design", { w: 32, h: 32, shape: "ellipse" })
	.set("designInput", { w: 32, h: 32, shape: "ellipse" })
	.set("designOutput", { w: 32, h: 32, shape: "ellipse" })
	.set("supplier", { w: 32, h: 32, shape: "ellipse" })
	.set("atom", { w: 32, h: 32, shape: "ellipse" })

	.set("compartment", { w: 50, h: 50, shape: "barrel" });

const getNodeClass = (node: cytoscape.NodeSingular): string => {
	return node.data("class");
};

const getNodeLabel = (node: cytoscape.NodeSingular): string => {
	return node.data("label");
};

export const elementShape = (node: cytoscape.NodeSingular) => {
	const nodeClass = getNodeClass(node);
	return elementStyleMap.get(nodeClass)?.shape || "ellipse";
};

export const elementContent = (node: cytoscape.NodeSingular) => {
	return getNodeLabel(node);
};

export const dimensions = (node: cytoscape.NodeSingular) => {
	const nodeClass = getNodeClass(node);
	console.log(
		`Getting dimensions of node ${node.id()} with class ${getNodeClass(node)}`
	);
	const dim = elementStyleMap.get(nodeClass);
	if (!dim) {
		throw new TypeError(`${nodeClass} does not have a default width / height`);
	}
	const { w, h } = dim;
	return { w, h };
};

export const width = (node: cytoscape.NodeSingular) => {
	return dimensions(node).w;
};

export const height = (node: cytoscape.NodeSingular) => {
	console.log(`Getting height of ${node.id()}`);
	return dimensions(node).h;
};
