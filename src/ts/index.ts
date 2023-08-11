import cytoscape from "cytoscape";
import { registerTooltips } from "./tooltips";
import {
	toggleDescendantsVisibilityOnClick,
	registerMakerClickHandler,
} from "./graph";
import { createElements } from "./elements/elements";

// import klay, { KlayLayoutOptions } from "cytoscape-klay";
// cytoscape.use(klay);

import dagre, { DagreLayoutOptions } from "cytoscape-dagre";
cytoscape.use(dagre);

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

	const elements = createElements(data);
	console.log(elements);

	var cy = cytoscape({
		container: document.getElementById("cy"),
		elements: elements,
		style: [
			{
				selector: "node[class='atom']",
				style: {
					shape: "round-rectangle",
					"background-color": "yellow",
					label: "data(label)", // Render the 'label' property as the node's label
					"text-wrap": "wrap", // Wrap the label text within the node
					width: "90px", // Set the node width to the width of its label text
					height: "40px", // Set the node height to the height of its label text
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
					"background-fit": "cover",
					"background-opacity": 0,
				},
			},
			{
				selector: "node[class='maker']",
				style: {
					height: "80px",
					width: "80px",
					"background-image":
						"https://raw.githubusercontent.com/timr11/project-data-visualizations/main/static/Maker.png",
				},
			},
			{
				selector: "node[class='supplier']",
				style: {
					height: "80px",
					width: "100px",
					"background-image":
						"https://raw.githubusercontent.com/timr11/project-data-visualizations/main/static/Supplier.png",
				},
			},
			{
				selector: "node[class='atom'][missing]",
				style: {
					"background-color": "red",
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
	});
	const boundingBox = cy.nodes().boundingBox();
	const centerX = (boundingBox.x1 + boundingBox.x2) / 2;
	const centerY = (boundingBox.y1 + boundingBox.y2) / 2;

	cy.layout({
		name: "dagre",
		dagre: {
			nodeSep: 2,
		},
	} as DagreLayoutOptions).run();

	// Flip everythin 180 degs
	cy.nodes().positions(function (node) {
		const oldX = node.position("x");
		const oldY = node.position("y");
		let newX =
			centerX +
			(oldX - centerX) * Math.cos(Math.PI) -
			(oldY - centerY) * Math.sin(Math.PI);
		let newY =
			centerY +
			(oldX - centerX) * Math.sin(Math.PI) +
			(oldY - centerY) * Math.cos(Math.PI);
		return {
			x: newX,
			y: newY,
		};
	});
	cy.fit();

	toggleDescendantsVisibilityOnClick(cy, ["maker"]);
	registerMakerClickHandler(cy);
	registerTooltips(cy);
};
