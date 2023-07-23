import { elementContent, elementShape } from "./element";
import {
	nodeClasses,
	dimensions,
	getNodeClass,
	shape,
	content,
	NodeClass,
	getNodeCss,
} from "./fulfillment-plan-nodes";
import cytoscape from "cytoscape";

export const styleItUp = (cy: cytoscape.Core) => {
	cy.style()
		.selector("node")
		.style({
			shape: (node: cytoscape.NodeSingular) => shape(getNodeClass(node)),
			content: content,
			"font-size": 20,
			"font-family": "Jost",
			width: (node: cytoscape.NodeSingular) => dimensions(getNodeClass(node)).w,
			height: (node: cytoscape.NodeSingular) =>
				dimensions(getNodeClass(node)).h,
			"text-valign": "center",
			"text-halign": "center",
			"border-color": "#555",
			"background-color": "#f6f6f6",
			"text-opacity": 1,
			opacity: 1,
			"text-outline-color": "white",
			"text-outline-opacity": 1,
			"text-outline-width": 0.75,
		})
		.selector("node:selected")
		.style({
			"background-color": "#d67614",
			"target-arrow-color": "#000",
			"text-outline-color": "#000",
		})
		.selector("node:active")
		.style({
			"overlay-color": "#d67614",
			"overlay-padding": "14",
		});

	for (let nc of nodeClasses) {
		cy.style()
			.selector(`node[class="${nc}"]`)
			.style(getNodeCss(nc as NodeClass));
	}
};
