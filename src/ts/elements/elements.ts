import cytoscape from "cytoscape";
import { Md5 } from "ts-md5";

type AtomId = string;

export type Atom = {
	id: AtomId;
	root: boolean;
	class: string;
	label: string;
};

export type Design = {
	name: string;
	product: AtomId;
	bom: AtomId[];
};

export type Maker = {
	class: string;
	label: string;
	designs: Design[];
};

type Supplier = {
	class: string;
	label: string;
	supplies: AtomId[];
};

type InputObject = Atom | Maker | Supplier;

export type InputData = InputObject[];

export const hash = (o: object): string => Md5.hashStr(JSON.stringify(o));

export const elementsEqual = (
	g1: cytoscape.ElementsDefinition,
	g2: cytoscape.ElementsDefinition
): boolean => {
	const g2NodesHashSet = new Set(g2.nodes.map((n) => hash(n)));
	const g2EdgesHashSet = new Set(g2.edges.map((e) => hash(e)));
	for (const node of g1.nodes) {
		if (!g2NodesHashSet.has(hash(node))) {
			return false;
		}
	}
	for (const edge of g1.edges) {
		if (!g2EdgesHashSet.has(hash(edge))) {
			return false;
		}
	}
	return true;
};

const createAtomNode = (atom: Atom): cytoscape.NodeDefinition => {
	return {
		data: {
			id: atom.id,
			root: atom.root,
			class: atom.class,
			label: atom.label,
		},
	};
};

const createMakerNode = (
	maker: Maker,
	product: Atom
): cytoscape.NodeDefinition => {
	const design = maker.designs.find((d) => d.product == product.id)!;
	return {
		data: {
			id: `maker-${maker.label}-${product.label}`,
			class: maker.class,
			label: `${maker.label} | ${product.label}`,
			product: product.id,
			bom: design.bom,
		},
	};
};

const createSupplierNode = (supplier: Supplier): cytoscape.NodeDefinition => {
	return {
		data: {
			id: `supplier-${supplier.label}`,
			class: supplier.class,
			label: supplier.label,
		},
	};
};

export const createElements = (
	inputData: InputData
): cytoscape.ElementsDefinition => {
	const atoms = inputData.filter(
		(e: InputObject) => e.class === "atom"
	) as Atom[];
	const makers = inputData.filter(
		(e: InputObject) => e.class === "maker"
	) as Maker[];
	const suppliers = inputData.filter(
		(e: InputObject) => e.class === "supplier"
	) as Supplier[];

	const atomsMap = atoms.reduce((map, atom) => {
		map.set(atom.id, atom);
		return map;
	}, new Map<AtomId, Atom>());
	const makersMap = makers.reduce((map, maker) => {
		for (let design of maker.designs) {
			const product = design.product;
			const makersOfProduct = map.get(product) || [];
			map.set(product, makersOfProduct.concat(maker));
		}
		return map;
	}, new Map<AtomId, Maker[]>());
	const suppliersMap = suppliers.reduce((map, supplier) => {
		for (let atom of supplier.supplies) {
			const suppliersOfAtom = map.get(atom) || [];
			map.set(atom, suppliersOfAtom.concat(supplier));
		}
		return map;
	}, new Map<AtomId, Supplier[]>());

	const concatGraphs = (
		g1: cytoscape.ElementsDefinition,
		g2: cytoscape.ElementsDefinition
	): cytoscape.ElementsDefinition => {
		return {
			nodes: g1.nodes.concat(g2.nodes),
			edges: g1.edges.concat(g2.edges),
		};
	};

	const getSupplierSubgraph = (atom: Atom): cytoscape.ElementsDefinition => {
		const atomSuppliers = suppliersMap.get(atom.id);
		let subGraph: cytoscape.ElementsDefinition = {
			nodes: [],
			edges: [],
		};
		if (atomSuppliers) {
			atomSuppliers.forEach((supplier) => {
				const supplierNode = createSupplierNode(supplier);
				subGraph.nodes.push(supplierNode);
				subGraph.edges.push({
					data: {
						id: `edge-${supplierNode.data.id}-${atom.id}`,
						source: supplierNode.data.id!,
						target: atom.id,
					},
				});
			});
		}
		return subGraph;
	};

	const isGraphEmpty = (g: cytoscape.ElementsDefinition): boolean => {
		return g.nodes.length === 0 && g.edges.length === 0;
	};

	const traverseGraph = (atom: Atom): cytoscape.ElementsDefinition => {
		let graph: cytoscape.ElementsDefinition = {
			nodes: [],
			edges: [],
		};

		let atomNode = createAtomNode(atom);
		graph.nodes.push(atomNode);

		// Add suppliers to the graph
		const supplierSubgraph = getSupplierSubgraph(atom);
		graph = concatGraphs(graph, supplierSubgraph);

		const makersOfAtom = makersMap.get(atom.id);
		if (makersOfAtom === undefined) {
			if (isGraphEmpty(supplierSubgraph)) {
				atomNode.data.missing = true;
				return { nodes: [atomNode], edges: [] };
			}
			// If there are no makers, return the supplier subgraph
			return graph;
		}

		// Get the sub-graphs of each maker of the atom
		for (const maker of makersOfAtom) {
			// First append the maker node

			const makerNode = createMakerNode(maker, atom);
			graph.nodes.push(makerNode);
			graph.edges.push({
				data: {
					id: `edge-${makerNode.data.id}-${atom.id}`,
					source: makerNode.data.id!,
					target: atom.id,
				},
			});

			for (const atomBOMId of makerNode.data.bom as AtomId[]) {
				const atomBOM = atomsMap.get(atomBOMId);
				if (!atomBOM) {
					continue;
				}
				graph.edges.push({
					data: {
						id: `edge-${makerNode.data.id}-${atomBOMId}`,
						source: atomBOMId,
						target: makerNode.data.id!,
					},
				});

				const atomBOMGraph = traverseGraph(atomBOM);
				graph.nodes.push(...atomBOMGraph.nodes);
				graph.edges.push(...atomBOMGraph.edges);
			}
		}
		return graph;
	};

	const rootAtoms = atoms.filter((atom) => atom.root);
	const elements = rootAtoms.reduce(
		(graph, rootAtom) => {
			const newGraph = traverseGraph(rootAtom);
			return concatGraphs(graph, newGraph);
		},
		{
			nodes: [],
			edges: [],
		} as cytoscape.ElementsDefinition
	);

	return elements;
};
