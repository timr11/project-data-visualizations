import cytoscape from "cytoscape";

document.addEventListener("DOMContentLoaded", function () {
	var cy = cytoscape({
		container: document.getElementById("cy"),
		elements: [
			{
				data: { id: "Devhawk Engineering" },
				classes: "maker",
			},
			{
				data: { id: "Robert's Chair Parts" },
				classes: "supplier",
			},
			{
				data: {
					id: "e1",
					source: "Devhawk Engineering",
					target: "Robert's Chair Parts",
				},
			},
		],
		style: [
			{
				selector: ".maker",
				style: {
					"background-image": "url(../public/assets/Maker.png)",
					shape: "rectangle",
					"background-fit": "contain",
					"background-opacity": 0,
				},
			},
			{
				selector: ".supplier",
				style: {
					"background-image": "url(../public/assets/Supplier.png)",
					shape: "rectangle",
					"background-fit": "contain",
					"background-opacity": 0,
				},
			},
			{
				selector: "edge",
				style: {
					width: 3,
					"line-color": "#ccc",
					"target-arrow-color": "#ccc",
					"target-arrow-shape": "triangle",
					"curve-style": "bezier",
				},
			},
		],
		layout: {
			name: "grid",
			rows: 2,
			cols: 1,
		},
	});
});
