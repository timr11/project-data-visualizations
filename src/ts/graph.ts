import cytoscape from "cytoscape";

const toggleVisibility = (n: cytoscape.NodeSingular) => {
	console.log(`Toggling the visibility of node ${n.id()}`);
	if (n.hidden()) {
		n.css({ visibility: "visible" });
		n.connectedEdges().forEach((edge) => {
			edge.css({ visibility: "visible" });
		});
	} else {
		n.css({ visibility: "hidden" });
		n.connectedEdges().forEach((edge) => {
			edge.css({ visibility: "hidden" });
		});
	}
};

/**
 * this method configures cytoscape to toggle the children of the nodes
 * whose class is contained in the input classes array.
 * @param cy  Cytoscape core instance
 * @param classes Classes of nodes whose children should hide on click.
 */
export const toggleDescendantsVisibilityOnClick = (
	cy: cytoscape.Core,
	classes: string[]
): void => {
	classes.forEach((className) => {
		const nodes = cy.$(`.${className}`);
		nodes.forEach((node) => {
			node.on("click", () => {
				const children = node.successors("node");
				children.forEach(toggleVisibility);
			});
		});
	});
};
