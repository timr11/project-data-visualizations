import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import tippy from "tippy.js";

cytoscape.use(popper);

const _makeTippy = (node: cytoscape.NodeSingular, text: string) => {
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

// For any in the "elements" JSON with
export const registerTooltips = (cy: cytoscape.Core) => {
	cy.nodes().forEach((node) => {
		const tooltipData: { [key: string]: string } = node.data()["tooltip"] || {};
		console.log(tooltipData);
		var tooltipStr: string = "";

		const keys = Object.keys(tooltipData);
		const len = keys.length;
		for (var i = 0; i < len; i++) {
			const key = keys[i];
			tooltipStr += key + ": " + tooltipData[key];
			if (i !== len - 1) {
				tooltipStr += "<br/>";
			}
		}

		_makeTippy(node, tooltipStr);
	});
};
