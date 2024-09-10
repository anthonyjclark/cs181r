import JXG from "https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.mjs";

export function kinematics(div_id, callback) {
	const board = JXG.JSXGraph.initBoard(div_id, {
		boundingbox: [-10, 10, 10, -10],
		keepaspectratio: true,
		showCopyright: false,
		axis: true,
	});

	function point(position, style) {
		style = style || { visible: false };
		return board.create("point", position, style);
	}

	const body_width = 2;
	const body_length = 1;

	const half_body_width = body_width / 2;
	const half_body_length = body_length / 2;

	const heading_length = 2;

	// ----------------------------------------------------------------
	// ▗▄▄▖         ▗▖
	// ▐▛▀▜▌        ▐▌
	// ▐▌ ▐▌ ▟█▙  ▟█▟▌▝█ █▌
	// ▐███ ▐▛ ▜▌▐▛ ▜▌ █▖█
	// ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌ ▐█▛
	// ▐▙▄▟▌▝█▄█▘▝█▄█▌  █▌
	// ▝▀▀▀  ▝▀▘  ▝▀▝▘  █
	//                 █▌
	// ----------------------------------------------------------------

	const body_center_point = point([0, 0], { name: "b", visible: false });

	const body_points = [
		point([-half_body_length, -half_body_width]),
		point([-half_body_length, half_body_width]),
		point([half_body_length, half_body_width]),
		point([half_body_length, -half_body_width]),
	];

	const robot_poly = board.create("polygon", body_points, {
		hasInnerPoints: true,
		borders: { strokeWidth: 0 },
		fillColor: "blue",
		highLightFillColor: "navy",
	});

	// Wheels

	// TODO: I'll need to use points to keep them group with the rest of the robot

	board.create("segment", [[-half_body_length, -half_body_width], [
		half_body_length,
		-half_body_width,
	]]);

	// ----------------------------------------------------------------
	//   ▄                                  █
	//  ▐█▌                 ▐▌        ▐▌    ▀
	//  ▐█▌ ▐▙██▖▐▙██▖ ▟█▙ ▐███  ▟██▖▐███  ██   ▟█▙ ▐▙██▖▗▟██▖
	//  █ █ ▐▛ ▐▌▐▛ ▐▌▐▛ ▜▌ ▐▌   ▘▄▟▌ ▐▌    █  ▐▛ ▜▌▐▛ ▐▌▐▙▄▖▘
	//  ███ ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌ ▐▌  ▗█▀▜▌ ▐▌    █  ▐▌ ▐▌▐▌ ▐▌ ▀▀█▖
	// ▗█ █▖▐▌ ▐▌▐▌ ▐▌▝█▄█▘ ▐▙▄ ▐▙▄█▌ ▐▙▄ ▗▄█▄▖▝█▄█▘▐▌ ▐▌▐▄▄▟▌
	// ▝▘ ▝▘▝▘ ▝▘▝▘ ▝▘ ▝▀▘   ▀▀  ▀▀▝▘  ▀▀ ▝▀▀▀▘ ▝▀▘ ▝▘ ▝▘ ▀▀▀
	// ----------------------------------------------------------------

	// Body reference frame

	const forward_point = point([heading_length, 0], { name: "x_b", color: "none", size: 8 });

	board.create("arrow", [body_center_point, forward_point], { highligh: false });

	const left_point = point([0, heading_length], { name: "y_b", color: "none", visible: false });

	board.create("arrow", [body_center_point, left_point]);

	// const rel_left_point = point([
	// 	() => body_center_point.X() - heading_length * Math.sin(phi.Value()),
	// 	() => body_center_point.Y() + heading_length * Math.cos(phi.Value()),
	// ], { name: "y_b", color: "none" });

	// Guide lines for global x and y

	const global_x = point(["X(b)", 0], { name: "x" });

	board.create("segment", [body_center_point, global_x], { dash: true });

	const global_y = point([0, "Y(b)"], { name: "y" });

	board.create("segment", [body_center_point, global_y], { dash: true });

	// Show the global phi value

	const along_global_x = point([() => body_center_point.X() + 1.0, () => body_center_point.Y()]);

	const phi = board.create("angle", [along_global_x, body_center_point, forward_point], {
		name: "ϕ",
		radius: 1,
	});

	// ----------------------------------------------------------------
	// ▗▄▄▖      ▗▖                    ▄▄
	// ▐▛▀▜▌     ▐▌         ▐▌        █▀▀▌
	// ▐▌ ▐▌ ▟█▙ ▐▙█▙  ▟█▙ ▐███      ▐▌    █▟█▌ ▟█▙ ▐▌ ▐▌▐▙█▙
	// ▐███ ▐▛ ▜▌▐▛ ▜▌▐▛ ▜▌ ▐▌       ▐▌▗▄▖ █▘  ▐▛ ▜▌▐▌ ▐▌▐▛ ▜▌
	// ▐▌▝█▖▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌ ▐▌       ▐▌▝▜▌ █   ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌
	// ▐▌ ▐▌▝█▄█▘▐█▄█▘▝█▄█▘ ▐▙▄       █▄▟▌ █   ▝█▄█▘▐▙▄█▌▐█▄█▘
	// ▝▘ ▝▀ ▝▀▘ ▝▘▀▘  ▝▀▘   ▀▀        ▀▀  ▀    ▝▀▘  ▀▀▝▘▐▌▀▘
	//                                                   ▐▌
	// ----------------------------------------------------------------

	const robot_points = [body_center_point, ...body_points, forward_point, left_point];

	const robot = board.create("group", robot_points);

	robot.setRotationCenter(body_center_point);
	robot.setRotationPoints(forward_point);

	// ----------------------------------------------------------------
	//  ▄▄▄        █         █       ▗▄▖         ▄▄             ▄▄   █
	//  ▀█▀        ▀   ▐▌    ▀       ▝▜▌        █▀▀▌           ▐▛▀   ▀
	//   █  ▐▙██▖ ██  ▐███  ██   ▟██▖ ▐▌       ▐▛    ▟█▙ ▐▙██▖▐███  ██   ▟█▟▌
	//   █  ▐▛ ▐▌  █   ▐▌    █   ▘▄▟▌ ▐▌       ▐▌   ▐▛ ▜▌▐▛ ▐▌ ▐▌    █  ▐▛ ▜▌
	//   █  ▐▌ ▐▌  █   ▐▌    █  ▗█▀▜▌ ▐▌       ▐▙   ▐▌ ▐▌▐▌ ▐▌ ▐▌    █  ▐▌ ▐▌
	//  ▄█▄ ▐▌ ▐▌▗▄█▄▖ ▐▙▄ ▗▄█▄▖▐▙▄█▌ ▐▙▄       █▄▄▌▝█▄█▘▐▌ ▐▌ ▐▌  ▗▄█▄▖▝█▄█▌
	//  ▀▀▀ ▝▘ ▝▘▝▀▀▀▘  ▀▀ ▝▀▀▀▘ ▀▀▝▘  ▀▀        ▀▀  ▝▀▘ ▝▘ ▝▘ ▝▘  ▝▀▀▀▘ ▞▀▐▌
	//                                                                   ▜█▛▘
	// ----------------------------------------------------------------

	// Set initial coordinates

	const initial_x = 3;
	const initial_y = 2;
	const initial_phi = Math.PI / 6;

	forward_point.moveTo([
		heading_length * Math.cos(initial_phi),
		heading_length * Math.sin(initial_phi),
	]);
	body_center_point.moveTo([initial_x, initial_y]);

	forward_point.on("drag", () => {
		callback(body_center_point.X(), body_center_point.Y(), phi.Value());
	});

	robot_poly.on("drag", () => {
		callback(body_center_point.X(), body_center_point.Y(), phi.Value());
	});

	callback(body_center_point.X(), body_center_point.Y(), phi.Value());

	return board;
}
