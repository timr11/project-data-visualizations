import cytoscape from "cytoscape";
import { registerTooltips } from "./tooltips";
import { toggleDescendantsVisibilityOnClick } from "./graph";

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

	registerTooltips(cy);
	toggleDescendantsVisibilityOnClick(cy, ["maker"]);
};
