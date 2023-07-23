import { styleMap2Str, StyleMap } from "./svg";

const baseRectangle = (
	x: number,
	y: number,
	w: number,
	h: number,
	r1: number,
	r2: number,
	r3: number,
	r4: number,
	styleMap: StyleMap
) => {
	return `
		<path ${styleMap2Str(styleMap)} d='
			M ${x + r1} ${y}
			L ${x + w - r2} ${y} Q ${x + w} ${y} ${x + w} ${y + r2}
			L ${x + w} ${y + h - r3} Q ${x + w} ${y + h} ${x + w - r3} ${y + h}
			L ${x + r4} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r4}
			L ${x} ${y + r1} Q ${x} ${y} ${x + r1} ${y}
			Z'
		/>
  `;
};

export const barrel = (
	x: number,
	y: number,
	width: number,
	height: number,
	styleMap: StyleMap
) => {
	return `

    <g ${styleMap2Str(styleMap)}>
      <path d="M ${0 * width + x} ${0.03 * height + y} L ${0 * width + x} ${
		0.97 * height + y
	} Q ${0.06 * width + x} ${height + y} ${0.25 * width + x} ${height + y}"/>

      <path d="M ${0.25 * width + x} ${height + y} L ${0.75 * width + x} ${
		height + y
	} Q ${0.95 * width + x} ${height + y} ${width + x} ${0.95 * height + y}"/>

      <path d="M ${width + x} ${0.95 * height + y} L ${width + x} ${
		0.05 * height + y
	} Q ${width + x} ${0 * height + y} ${0.75 * width + x} ${0 * height + y}"/>

      <path d="M ${0.75 * width + x} ${0 * height + y} L ${0.25 * width + x} ${
		0 * height + y
	} Q ${0.06 * width + x} ${0 * height + y} ${0 * width + x} ${
		0.03 * height + y
	}"/>
    </g>

    `;
};

export const circle = (
	cx: number,
	cy: number,
	r: number,
	styleMap: StyleMap
) => {
	return `<circle cx='${cx}' cy='${cy}' r='${r}' ${styleMap2Str(styleMap)} />`;
};

export const clipPath = (
	id: string,
	baseShapeFn: Function,
	baseShapeFnArgs: any,
	styleMap: StyleMap
) => {
	return `
			<defs>
				<clipPath id='${id}' ${styleMap2Str(styleMap)}>
					${baseShapeFn(...baseShapeFnArgs)}
				</clipPath>
			</defs>
		`;
};

export const concaveHexagon = (
	x: number,
	y: number,
	width: number,
	height: number,
	styleMap: StyleMap
) => {
	return `
			<polygon ${styleMap2Str(styleMap)}
				points='${x + 0}, ${y + 0}, ${x + width},
				${y + 0}, ${x + 0.85 * width}, ${y + 0.5 * height},
				${x + width}, ${y + height}, ${x + 0}, ${y + height},
				${x + 0.15 * width}, ${y + 0.5 * height}'
			/>
		`;
};

export const cutRectangle = (
	x: number,
	y: number,
	width: number,
	height: number,
	cornerLength: number,
	styleMap: StyleMap
) => {
	return `
			<polygon ${styleMap2Str(styleMap)}
				points=' ${x + 0 * width} ${y + cornerLength}
				${x + cornerLength} ${y + 0 * height}
				${x + width - cornerLength} ${y + 0 * height}
				${x + width} ${y + cornerLength} ${x + width}
				${y + height - cornerLength} ${x + width - cornerLength}
				${y + height} ${x + cornerLength} ${y + height}
				${x + 0 * width} ${y + height - cornerLength}'
			/>
    `;
};

export const ellipse = (
	cx: number,
	cy: number,
	rx: number,
	ry: number,
	styleMap: StyleMap
) => {
	return `
			<ellipse cx='${cx}' cy='${cy}' rx='${rx}' ry='${ry}' ${styleMap2Str(styleMap)}/>
		`;
};

export const hexagon = (
	x: number,
	y: number,
	width: number,
	height: number,
	styleMap: StyleMap
) => {
	return `
			<polygon ${styleMap2Str(styleMap)}
				points='${x + 0}, ${y + 0.5 * height}, ${x + 0.25 * width},
				${y + 0 * height}, ${x + 0.75 * width}, ${y + 0 * height},
				${x + width}, ${y + 0.5 * height}, ${x + 0.75 * width},
				${y + height}, ${x + 0.25 * width}, ${y + height}'
			/>
		`;
};

export const line = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	styleMap: StyleMap
) => {
	return `
			<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' ${styleMap2Str(styleMap)} />
		`;
};

export const rectangle = (
	x: number,
	y: number,
	width: number,
	height: number,
	styleMap: StyleMap
) => {
	return baseRectangle(x, y, width, height, 0, 0, 0, 0, styleMap);
};

export const roundBottomRectangle = (
	x: number,
	y: number,
	width: number,
	height: number,
	styleMap: StyleMap
) => {
	return baseRectangle(
		x,
		y,
		width,
		height,
		0,
		0,
		0.3 * height,
		0.3 * height,
		styleMap
	);
};

export const roundRectangle = (
	x: number,
	y: number,
	width: number,
	height: number,
	styleMap: StyleMap
) => {
	return baseRectangle(
		x,
		y,
		width,
		height,
		0.04 * width,
		0.04 * width,
		0.04 * width,
		0.04 * width,
		styleMap
	);
};

export const stadium = (
	x: number,
	y: number,
	width: number,
	height: number,
	styleMap: StyleMap
) => {
	const radiusRatio = 0.24 * Math.max(width, height);
	return baseRectangle(
		x,
		y,
		width,
		height,
		radiusRatio,
		radiusRatio,
		radiusRatio,
		radiusRatio,
		styleMap
	);
};

export const square = (
	x: number,
	y: number,
	length: number,
	styleMap: StyleMap
) => {
	return baseRectangle(x, y, length, length, 0, 0, 0, 0, styleMap);
};

export const text = (t: string, x: number, y: number, styleMap: StyleMap) => {
	return `<text x='${x}' y='${y}' ${styleMap2Str(styleMap)}>${t}</text>`;
};
