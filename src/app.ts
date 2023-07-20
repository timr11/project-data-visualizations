import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import tippy from "tippy.js";

cytoscape.use(popper);

export function drawGraph(div_id: string, data: any) {
	// @ts-ignore
	var dbgr = new CommAPI("debugger", (ret) => {});
	// @ts-ignore
	dbgr.call({ data: "woo woo" });

	var cyDiv = document.createElement("div") as HTMLElement;
	cyDiv.id = "cy";
	cyDiv.className = "fullscreen";
	document.querySelector(div_id)?.appendChild(cyDiv);

	var cy = cytoscape({
		container: document.getElementById("cy"),
		elements:
			// data["elements"],
			{
				nodes: [
					{
						data: {
							id: "Devhawk Engineering",
							product: {
								identifier: "Q15026",
								description: "chair",
							},
						},
						classes: "maker",
					},
					{
						data: {
							id: "Robert's Chair Parts",
							product: {
								identifier: "Q15026",
								description: "chair",
							},
						},
						classes: "supplier",
					},
				],
				edges: [
					{
						data: {
							id: "e1",
							source: "Devhawk Engineering",
							target: "Robert's Chair Parts",
						},
					},
				],
			},
		style: [
			{
				selector: ".maker",
				style: {
					shape: "rectangle",
					backgroundColor: "red",
					// "background-fit": "contain",
					// "background-opacity": 0,
					// "background-image": "url(../public/assets/Maker.png)",
				},
			},
			{
				selector: ".supplier",
				style: {
					shape: "rectangle",
					backgroundColor: "blue",
					// "background-fit": "contain",
					// "background-opacity": 0,
					// "background-image": "url(../public/assets/Supplier.png)",
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

	var makeTippy = function (node: cytoscape.NodeSingular, text: string) {
		var ref = node.popperRef();
		var dummyDomEle = document.createElement("div");

		var tip = tippy(dummyDomEle, {
			getReferenceClientRect: ref.getBoundingClientRect,
			trigger: "manual",
			content: function () {
				var div = document.createElement("div");

				div.innerHTML = text;

				return div;
			},
			arrow: true,
			placement: "bottom",
			hideOnClick: false,
			sticky: "reference",

			interactive: true,
			appendTo: document.body,
		});

		node.on("mouseover", () => tip.show());
		node.on("mouseout", () => tip.hide());

		return tip;
	};

	cy.nodes().forEach((node) => {
		var product = node.data()["product"];
		if (node.classes().includes("maker"))
			makeTippy(
				node,
				`ID: ${product["identifier"]}<br/>Description: ${product["description"]}`
			);
	});
}
