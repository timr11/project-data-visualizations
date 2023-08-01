import cytoscape from "cytoscape";
import { registerTooltips } from "./tooltips";
import {
	toggleDescendantsVisibilityOnClick,
	registerMakerClickHandler,
} from "./graph";
import { createElements } from "./elements/elements";

import klay, { KlayLayoutOptions } from "cytoscape-klay";
cytoscape.use(klay);

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
	await new Promise((r) => setTimeout(r, 300));

	console.log(data["inputData"]);
	const elements = createElements(data["inputData"]);

	var cy = cytoscape({
		container: document.getElementById("cy"),
		elements: elements,
		style: [
			{
				selector: "node",
				style: {},
			},
			{
				selector: "node[class='atom']",
				style: {
					"background-color": "yellow",
					label: "data(label)", // Render the 'label' property as the node's label
					"text-wrap": "wrap", // Wrap the label text within the node
					width: "100px", // Set the node width to the width of its label text
					height: "60px", // Set the node height to the height of its label text
					"text-max-width": "100px", // Adjust the maximum width of the text to fit inside the node
					"text-valign": "center", // Vertically center the text within the node
					"text-halign": "center", // Horizontally center the text within the node
					"border-width": "1px", // Customize the border width of the node
					"border-color": "black", // Customize the border color of the node
				},
			},
			{
				selector: "node[class='maker'], node[class='supplier']",
				style: {
					shape: "rectangle",
					width: "60px",
					height: "60px",
					"background-fit": "cover",
					"background-opacity": 0,
				},
			},
			{
				selector: "node[class='maker']",
				style: {
					"background-image":
						"https://raw.githubusercontent.com/timr11/project-data-visualizations/main/public/assets/Maker.png",
				},
			},
			{
				selector: "node[class='supplier']",
				style: {
					"background-image":
						"https://raw.githubusercontent.com/timr11/project-data-visualizations/main/public/assets/Supplier.png",
				},
			},
			// {
			// 	selector: "node[class='atom'][^missing]",
			// 	style: {
			// 		"background-color": "lightyellow",
			// 	},
			// },
			{
				selector: "node[class='atom'][missing]",
				style: {
					"background-color": "lightpink",
				},
			},
			{
				selector: "node[class='atom'][?root]",
				style: {
					"background-color": "green",
				},
			},
			{
				selector: ".highlighted",
				style: {
					"border-color": "lightgreen",
					"border-width": 5,
					"border-style": "solid",
					"border-opacity": 1,
				},
			},
			{
				selector: "edge",
				style: {
					"curve-style": "bezier",
					"target-arrow-shape": "triangle",
				},
			},
		],
		layout: {
			name: "klay",
			klay: {
				direction: "UP",
				nodePlacement: "LINEAR_SEGMENTS",
			},
		} as KlayLayoutOptions,
	});

	toggleDescendantsVisibilityOnClick(cy, ["maker"]);
	registerMakerClickHandler(cy);
};
