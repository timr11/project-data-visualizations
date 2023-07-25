import cytoscape from "cytoscape";
import { createElements, InputData, elementsEqual } from "../elements";
import inputData from "./input-data.json";
import expectedElements from "./elements.json";
import { Md5 } from "ts-md5";

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

	it("a -> m -> b -> m -> c", () => {
		const inputData: InputData = [];
		const atomIds = ["c", "b", "a"];
		atomIds.forEach((id: string, i: number) =>
			inputData.push({ id: id, root: i === 0, class: "atom", label: id })
		);
		inputData.push({
			class: "maker",
			label: "m",
			designs: [
				{
					name: "c designs",
					product: "c",
					bom: ["b"],
				},
				{
					name: "c designs",
					product: "b",
					bom: ["a"],
				},
			],
		});
		const expectedNodes: cytoscape.NodeDefinition[] = [
			{
				data: {
					id: "c",
					root: true,
					class: "atom",
					label: "c",
				},
			},
			{
				data: {
					id: "b",
					root: false,
					class: "atom",
					label: "b",
				},
			},
			{
				data: {
					id: "a",
					root: false,
					class: "atom",
					label: "a",
					missing: true,
				},
			},
		];
		expectedNodes.push(
			{
				data: {
					id: "maker-m-c",
					class: "maker",
					label: "m | c",
					product: "c",
					bom: ["b"],
				},
			},
			{
				data: {
					id: "maker-m-b",
					class: "maker",
					label: "m | b",
					product: "b",
					bom: ["a"],
				},
			}
		);
		const expectedEdges: cytoscape.EdgeDefinition[] = [
			{
				data: {
					id: "edge-c-maker-m-c",
					source: "c",
					target: "maker-m-c",
				},
			},
			{
				data: {
					id: "edge-maker-m-c-b",
					source: "maker-m-c",
					target: "b",
				},
			},
			{
				data: {
					id: "edge-b-maker-m-b",
					source: "b",
					target: "maker-m-b",
				},
			},
			{
				data: {
					id: "edge-maker-m-b-a",
					source: "maker-m-b",
					target: "a",
				},
			},
		];
		const expectedElements: cytoscape.ElementsDefinition = {
			nodes: expectedNodes,
			edges: expectedEdges,
		};
		const elements = createElements(inputData);
		expect(elementsEqual(elements, expectedElements)).toBe(true);
	});
});
