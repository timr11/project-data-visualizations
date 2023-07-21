import cytoscape from "cytoscape";
import { registerTooltips } from "./tooltips";

export const drawGraph = async (divId: string, data: any) => {
	// Append a div to the parent div, which will host the
	// cytoscape graph.
	var parent = document.querySelector(divId)!;
	var cyDiv = document.createElement("div") as HTMLElement;
	cyDiv.id = "cy";
	parent.appendChild(cyDiv);
	parent.className = "fullscreen";

	// Wait until DOM content is loaded before rendering the graph.
	// Ideally we'd use document.addEventListener("DOMContentLoaded", () => {})
	// but that's not working with the ipynb for some reason...
	await new Promise((r) => setTimeout(r, 500));

	var cy = cytoscape({
		container: document.getElementById("cy"),
		elements: data["elements"],
		style: data["style"],
		layout: data["layout"],
	});

	cy.on("click", "node", (event) => {
		var node: cytoscape.NodeSingular = event.target;
		console.log("Clicked " + node.data("id"));

		var suppliers = cy.$(".supplier");
		suppliers.forEach((node) => {
			if (node.hidden()) {
				node.css({ visibility: "visible" });
				node.connectedEdges().forEach((edge) => {
					edge.css({ visibility: "visible" });
				});
			} else {
				node.css({ visibility: "hidden" });
				node.connectedEdges().forEach((edge) => {
					edge.css({ visibility: "hidden" });
				});
			}
		});
	});

	registerTooltips(cy);
};
