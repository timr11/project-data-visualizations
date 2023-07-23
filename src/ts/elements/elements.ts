import cytoscape from "cytoscape";

type AtomId = string;

type Atom = {
	id: AtomId;
	root: boolean;
	class: string;
	label: string;
};

type Design = {
	name: string;
	product: AtomId;
	bom: AtomId[];
};

type Maker = {
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

const createAtomElement = (atom: Atom): cytoscape.NodeDefinition => {
	return {
		data: {
			id: atom.id,
			root: atom.root,
			class: atom.class,
			label: atom.label,
		},
	};
};

const createMakerElement = (
	maker: Maker,
	makerId: string
): cytoscape.NodeDefinition => {
	return {
		data: {
			id: makerId,
			class: maker.class,
			label: maker.label,
			designs: maker.designs,
		},
	};
};

const createSupplierElement = (
	supplier: Supplier,
	supplierId: string
): cytoscape.NodeDefinition => {
	return {
		data: {
			id: supplierId,
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

	const nodes = [
		...atoms.map((atom) => createAtomElement(atom)),
		...makers.map((maker, i) => createMakerElement(maker, `maker-${i}`)),
		...suppliers.map((supplier, i) =>
			createSupplierElement(supplier, `supplier-${i}`)
		),
	];

	const atomsMap = atoms.reduce((map, atom) => {
		map.set(atom.id, atom);
		return map;
	}, new Map<AtomId, Atom>());
	const rootAtoms = atoms.filter((atom) => atom.root);

	const makerToProductEdges: cytoscape.EdgeDefinition[] = [];
	const bomToMakerEdges: cytoscape.EdgeDefinition[] = [];
	var edgeIdCtr = 0;
	makers.forEach((maker, i) => {
		const makerId = `maker-${i}`;
		maker.designs.forEach((design) => {
			// Add an edge from the maker to the product it creates
			const edgeId = `edge-${edgeIdCtr++}`;
			makerToProductEdges.push({
				data: {
					id: edgeId,
					source: makerId,
					target: design.product,
				},
			});

			// Add an edge from all required BOMs to the maker
			for (let atomId of design.bom) {
				const edgeId = `edge-${edgeIdCtr++}`;
				bomToMakerEdges.push({
					data: {
						id: edgeId,
						source: atomId,
						target: makerId,
					},
				});
			}
		});
	});

	const supplierToSuppliesEdges: cytoscape.EdgeDefinition[] = [];
	suppliers.forEach((supplier, i) => {
		const supplierId = `supplier-${i}`;
		supplier.supplies.forEach((supply) => {
			const edgeId = `edge-${edgeIdCtr++}`;
			supplierToSuppliesEdges.push({
				data: {
					id: edgeId,
					source: supplierId,
					target: supply,
				},
			});
		});
	});

	const edges = [
		...makerToProductEdges,
		...bomToMakerEdges,
		...supplierToSuppliesEdges,
	];

	return {
		nodes: nodes,
		edges: edges,
	};
};

const assignWeightsRecursively = (n: cytoscape.NodeSingular, level: number) => {
	n.data("weight", level);
	const nc = n.data("class");
	switch (nc) {
		case "atom":
			const atomMakers = n.incomers("node");
			for (let atomMaker of atomMakers) {
				if (atomMaker.data("weight") === undefined) {
					assignWeightsRecursively(atomMaker, level + 1);
				}
			}
			break;
		case "maker":
			const makerAtomBOMs = n.incomers("node");
			for (let atom of makerAtomBOMs) {
				if (atom.data("weight") === undefined) {
					assignWeightsRecursively(atom, level + 1);
				}
			}
			break;
		case "supplier":
			break;
	}
};

export const assignWeights = (cy: cytoscape.Core) => {
	const roots = cy.$("node[?root]");
	for (let root of roots) {
		assignWeightsRecursively(root, 0);
	}
};
