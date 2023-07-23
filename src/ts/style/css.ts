import cytoscape, { Css } from "cytoscape";

import {
	maker,
	makerDesign,
	designInput,
	designOutput,
	supplier,
	atom,
} from "./fulfillment-plan-nodes";
import { NodeClass } from "./fulfillment-plan-nodes";

const cacheKeyFn = (node: any) => "" + JSON.stringify(node.id());
