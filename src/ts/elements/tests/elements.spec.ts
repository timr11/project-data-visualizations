import { createElements } from "../elements";
import inputData from "./input-data.json";
import expectedElements from "./elements.json";

describe("createElements", () => {
	it("creates atom, maker and supplier nodes correctly", () => {
		const expectedNodes: cytoscape.NodeDefinition[] = expectedElements.nodes;
		const nodes = createElements(inputData).nodes;
		expect(nodes).toEqual(expectedNodes);
	});

	it("creates an edge from makers to the products they make", () => {
		const elements = createElements(inputData);
		expect(elements).toHaveProperty("edges");
		const edges = elements.edges;
		expect(
			edges.some((e) => e.data.source == "maker-0" && e.data.target == "Q15026")
		).toBe(true);
	});

	it("creates edges from bom items required by maker's designs to the makers", () => {
		const elements = createElements(inputData);
		const edges = elements.edges;

		const edgeMatches = (
			e: cytoscape.EdgeDefinition,
			source: string,
			target: string
		) => {
			return e.data.source == source && e.data.target == target;
		};
		expect(edges.some((e) => edgeMatches(e, "QH100", "maker-0"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH101", "maker-0"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH102", "maker-0"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH108", "maker-0"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH103", "maker-0"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH104", "maker-0"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH105", "maker-1"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH106", "maker-1"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "QH107", "maker-1"))).toBe(true);
	});

	it("creates edges from suppliers to the atoms they supply", () => {
		const elements = createElements(inputData);
		const edges = elements.edges;

		const edgeMatches = (
			e: cytoscape.EdgeDefinition,
			source: string,
			target: string
		) => {
			return e.data.source == source && e.data.target == target;
		};
		expect(edges.some((e) => edgeMatches(e, "supplier-0", "QH103"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "supplier-0", "QH104"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "supplier-0", "QH106"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "supplier-0", "QH107"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "supplier-0", "QH108"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "supplier-1", "QH102"))).toBe(true);
		expect(edges.some((e) => edgeMatches(e, "supplier-1", "QH100"))).toBe(true);
	});
});
