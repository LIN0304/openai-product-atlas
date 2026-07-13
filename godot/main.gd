extends Node2D

const DATA_PATH := "res://data/openai-product-timeline-v0.1.json"
const WORLD_BOUNDS := Rect2(72.0, 54.0, 3600.0, 1538.0)
const MIN_ZOOM := 0.09
const MAX_ZOOM := 1.85
const PLAYER_SPEED := 410.0
const NODE_PICK_RADIUS := 25.0

const INK := Color("d8f7ee")
const MUTED := Color("7d9d99")
const GRID := Color("15322f")
const GRID_MAJOR := Color("1b4540")
const VOID := Color("05070b")
const PANEL := Color("09110f")
const ACCENT := Color("58f6d0")
const ALERT := Color("ffcc66")
const DISPLAY_FONT: Font = preload("res://assets/fonts/NotoSansCJKtc-TimelineSubset.otf")

@onready var camera: Camera2D = $Camera2D
@onready var hud: Control = $Interface/Hud

var timeline: Dictionary = {}
var events: Array = []
var taxonomy: Array = []
var event_by_id: Dictionary = {}
var family_events: Dictionary = {}
var selected_event: Dictionary = {}
var player_position := Vector2(220.0, 174.0)
var player_target_event: Dictionary = {}
var ascii_mode := false
var pulse_time := 0.0
var dragging := false
var drag_distance := 0.0
var pointer_down_position := Vector2.ZERO
var last_pointer_position := Vector2.ZERO
var active_touches: Dictionary = {}
var previous_pinch_distance := 0.0
var has_loaded := false
var load_error := ""

var title_label: Label
var status_label: Label
var detail_date: Label
var detail_family: Label
var detail_title_en: Label
var detail_title_zh: Label
var detail_summary: Label
var detail_source: Label
var source_button: Button
var ascii_button: Button
var detail_panel: PanelContainer
var mobile_help_label: Label
var display_font: Font = DISPLAY_FONT
var top_panel: PanelContainer
var help_panel: PanelContainer
var zoom_out_button: Button
var zoom_in_button: Button
var reset_button: Button
var top_margin: MarginContainer
var top_row: HBoxContainer
var title_stack: VBoxContainer


func _ready() -> void:
	_build_hud()
	_load_timeline()
	get_viewport().size_changed.connect(_on_viewport_resized)
	_on_viewport_resized()
	call_deferred("_reset_view")
	queue_redraw()


func _load_timeline() -> void:
	if not FileAccess.file_exists(DATA_PATH):
		load_error = "DATA OFFLINE // missing %s" % DATA_PATH
		_update_status()
		return

	var source := FileAccess.get_file_as_string(DATA_PATH)
	var parsed: Variant = JSON.parse_string(source)
	if not parsed is Dictionary:
		load_error = "DATA ERROR // timeline JSON could not be parsed"
		_update_status()
		return

	timeline = parsed
	events = timeline.get("events", [])
	taxonomy = timeline.get("taxonomy", [])
	if events.is_empty() or taxonomy.is_empty():
		load_error = "DATA ERROR // no map nodes found"
		_update_status()
		return

	event_by_id.clear()
	family_events.clear()
	for family in taxonomy:
		family_events[str(family.get("id", "unknown"))] = []
	for item in events:
		var event: Dictionary = item
		event_by_id[str(event.get("event_id", ""))] = event
		var family_id := str(event.get("product_family", "unknown"))
		if not family_events.has(family_id):
			family_events[family_id] = []
		family_events[family_id].append(event)
	for family_id in family_events:
		family_events[family_id].sort_custom(func(a: Dictionary, b: Dictionary) -> bool: return str(a.get("date", "")) < str(b.get("date", "")))

	var stats: Dictionary = timeline.get("stats", {})
	var landmark_count := 0
	for item in events:
		var event: Dictionary = item
		if str(event.get("node_tier", "")) == "landmark" or int(event.get("importance", 0)) >= 5:
			landmark_count += 1
	var expected_nodes := int(stats.get("canonical_map_nodes", events.size()))
	var expected_landmarks := int(stats.get("landmarks", landmark_count))
	var expected_families := int(stats.get("product_families", taxonomy.size()))
	if events.size() != expected_nodes or landmark_count != expected_landmarks or taxonomy.size() != expected_families:
		load_error = "DATA ERROR // manifest counts do not match map records"
		push_error("%s nodes=%d/%d landmarks=%d/%d regions=%d/%d" % [load_error, events.size(), expected_nodes, landmark_count, expected_landmarks, taxonomy.size(), expected_families])
		_update_status()
		return
	print("TIMELINE READY // nodes=%d landmarks=%d regions=%d" % [events.size(), landmark_count, taxonomy.size()])

	has_loaded = true
	var first: Dictionary = events.front()
	player_position = _event_position(first)
	_select_event(first, false)
	_update_status()


func _process(delta: float) -> void:
	pulse_time += delta
	var move_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	if move_vector.length_squared() > 0.0:
		player_position += move_vector * PLAYER_SPEED * delta / maxf(camera.zoom.x, 0.35)
		player_position.x = clampf(player_position.x, WORLD_BOUNDS.position.x, WORLD_BOUNDS.end.x)
		player_position.y = clampf(player_position.y, WORLD_BOUNDS.position.y, WORLD_BOUNDS.end.y)
		camera.position = camera.position.lerp(player_position, minf(delta * 4.0, 1.0))
	queue_redraw()


func _draw() -> void:
	draw_rect(Rect2(-2500.0, -2500.0, 8500.0, 6500.0), VOID, true)
	_draw_world_frame()
	if not has_loaded:
		_draw_loading_fault()
		return
	_draw_year_grid()
	_draw_lanes()
	_draw_paths()
	_draw_nodes()
	_draw_player()


func _draw_world_frame() -> void:
	draw_rect(WORLD_BOUNDS.grow(18.0), Color("020403"), true)
	draw_rect(WORLD_BOUNDS.grow(18.0), Color("275c54"), false, 3.0)
	for x in range(int(WORLD_BOUNDS.position.x), int(WORLD_BOUNDS.end.x) + 1, 32):
		var color := GRID_MAJOR if (x - int(WORLD_BOUNDS.position.x)) % 160 == 0 else GRID
		draw_line(Vector2(x, WORLD_BOUNDS.position.y), Vector2(x, WORLD_BOUNDS.end.y), color, 1.0)
	for y in range(int(WORLD_BOUNDS.position.y), int(WORLD_BOUNDS.end.y) + 1, 32):
		var color := GRID_MAJOR if (y - int(WORLD_BOUNDS.position.y)) % 160 == 0 else GRID
		draw_line(Vector2(WORLD_BOUNDS.position.x, y), Vector2(WORLD_BOUNDS.end.x, y), color, 1.0)
	var font: Font = display_font
	draw_string(font, Vector2(92.0, 39.0), "OPENAI PRODUCT ATLAS // 2022—2026 // GODOT NATIVE WORLD", HORIZONTAL_ALIGNMENT_LEFT, -1.0, 18, MUTED)


func _draw_loading_fault() -> void:
	var font: Font = display_font
	draw_rect(Rect2(620.0, 650.0, 2500.0, 220.0), Color("15090a"), true)
	draw_rect(Rect2(620.0, 650.0, 2500.0, 220.0), Color("ef6f78"), false, 4.0)
	draw_string(font, Vector2(690.0, 745.0), load_error if load_error != "" else "BOOTING ARCHIVE…", HORIZONTAL_ALIGNMENT_LEFT, -1.0, 36, Color("ff9ca3"))
	draw_string(font, Vector2(690.0, 805.0), "The text timeline remains available in the surrounding web interface.", HORIZONTAL_ALIGNMENT_LEFT, -1.0, 20, MUTED)


func _draw_year_grid() -> void:
	var font: Font = display_font
	var years: Dictionary = {}
	for item in events:
		var event: Dictionary = item
		var year := int(event.get("year", 0))
		var x := float(event.get("x_hint", WORLD_BOUNDS.position.x))
		if year > 0 and (not years.has(year) or x < float(years[year])):
			years[year] = x
	var year_keys := years.keys()
	year_keys.sort()
	for key in year_keys:
		var x: float = years[key]
		draw_line(Vector2(x, WORLD_BOUNDS.position.y), Vector2(x, WORLD_BOUNDS.end.y), Color("3a746b"), 2.0)
		draw_rect(Rect2(x - 42.0, 60.0, 84.0, 34.0), Color("0d201d"), true)
		draw_rect(Rect2(x - 42.0, 60.0, 84.0, 34.0), Color("4a9287"), false, 2.0)
		draw_string(font, Vector2(x - 27.0, 85.0), str(key), HORIZONTAL_ALIGNMENT_LEFT, -1.0, 18, INK)


func _draw_lanes() -> void:
	var font: Font = display_font
	for item in taxonomy:
		var family: Dictionary = item
		var lane := int(family.get("lane", 0))
		var y := 104.0 + lane * 148.0
		var lane_color := _event_color(family)
		var band := Rect2(WORLD_BOUNDS.position.x + 8.0, y, WORLD_BOUNDS.size.x - 16.0, 122.0)
		draw_rect(band, Color(lane_color.r, lane_color.g, lane_color.b, 0.045), true)
		draw_line(Vector2(band.position.x, band.end.y), Vector2(band.end.x, band.end.y), Color(lane_color.r, lane_color.g, lane_color.b, 0.25), 2.0)
		draw_rect(Rect2(90.0, y + 13.0, 116.0, 92.0), Color("07100e"), true)
		draw_rect(Rect2(90.0, y + 13.0, 116.0, 92.0), lane_color.darkened(0.2), false, 2.0)
		draw_string(font, Vector2(108.0, y + 56.0), str(family.get("glyph", "?")), HORIZONTAL_ALIGNMENT_LEFT, -1.0, 34, lane_color)
		draw_string(font, Vector2(146.0, y + 42.0), "%02d" % (lane + 1), HORIZONTAL_ALIGNMENT_LEFT, -1.0, 13, MUTED)
		draw_string(font, Vector2(108.0, y + 82.0), str(family.get("region", "UNKNOWN")).to_upper(), HORIZONTAL_ALIGNMENT_LEFT, 90.0, 10, INK)


func _draw_paths() -> void:
	for item in taxonomy:
		var family: Dictionary = item
		var family_id := str(family.get("id", ""))
		var lane_nodes: Array = family_events.get(family_id, [])
		if lane_nodes.size() < 2:
			continue
		var base_color := _event_color(family)
		var path_color := Color(base_color.r, base_color.g, base_color.b, 0.32)
		for index in range(lane_nodes.size() - 1):
			var from := _event_position(lane_nodes[index])
			var to := _event_position(lane_nodes[index + 1])
			var elbow := Vector2(to.x, from.y)
			draw_line(from, elbow, Color("06100e"), 6.0)
			draw_line(elbow, to, Color("06100e"), 6.0)
			draw_line(from, elbow, path_color, 2.0)
			draw_line(elbow, to, path_color, 2.0)


func _draw_nodes() -> void:
	var font: Font = display_font
	for item in events:
		var event: Dictionary = item
		var position := _event_position(event)
		var color := _event_color(event)
		var is_landmark := str(event.get("node_tier", "")) == "landmark" or int(event.get("importance", 0)) >= 5
		var is_selected := not selected_event.is_empty() and str(event.get("event_id", "")) == str(selected_event.get("event_id", ""))
		if ascii_mode:
			if is_landmark:
				draw_rect(Rect2(position - Vector2(15.0, 19.0), Vector2(30.0, 30.0)), Color(color.r, color.g, color.b, 0.1), true)
				draw_rect(Rect2(position - Vector2(15.0, 19.0), Vector2(30.0, 30.0)), color, false, 2.0)
			draw_string(font, position + Vector2(-7.0, 8.0), str(event.get("glyph", "+")), HORIZONTAL_ALIGNMENT_LEFT, -1.0, 21 if is_landmark else 16, color)
		else:
			var radius := 10.0 if is_landmark else 5.0 + float(event.get("importance", 3))
			draw_rect(Rect2(position - Vector2(radius + 3.0, radius + 3.0), Vector2((radius + 3.0) * 2.0, (radius + 3.0) * 2.0)), Color("020504"), true)
			if is_landmark:
				var pulse := 2.0 + (sin(pulse_time * 2.4 + position.x * 0.02) + 1.0) * 2.0
				draw_rect(Rect2(position - Vector2(radius + pulse, radius + pulse), Vector2((radius + pulse) * 2.0, (radius + pulse) * 2.0)), Color(color.r, color.g, color.b, 0.32), false, 2.0)
				draw_colored_polygon(PackedVector2Array([position + Vector2(0.0, -radius), position + Vector2(radius, 0.0), position + Vector2(0.0, radius), position + Vector2(-radius, 0.0)]), color)
			else:
				draw_rect(Rect2(position - Vector2(radius, radius), Vector2(radius * 2.0, radius * 2.0)), color, true)
		if is_selected:
			var focus_radius := 22.0 + sin(pulse_time * 4.0) * 2.0
			draw_arc(position, focus_radius, 0.0, TAU, 24, Color.WHITE, 3.0)
			draw_line(position + Vector2(0.0, -focus_radius - 18.0), position + Vector2(0.0, -focus_radius - 5.0), Color.WHITE, 2.0)


func _draw_player() -> void:
	var color := Color.WHITE
	var p := player_position
	draw_rect(Rect2(p - Vector2(7.0, 11.0), Vector2(14.0, 18.0)), Color("020504"), true)
	draw_rect(Rect2(p - Vector2(5.0, 9.0), Vector2(10.0, 12.0)), color, true)
	draw_rect(Rect2(p + Vector2(-8.0, 3.0), Vector2(16.0, 4.0)), ACCENT, true)
	draw_rect(Rect2(p + Vector2(-7.0, 9.0), Vector2(4.0, 6.0)), color, true)
	draw_rect(Rect2(p + Vector2(3.0, 9.0), Vector2(4.0, 6.0)), color, true)
	draw_string(display_font, p + Vector2(13.0, -11.0), "ARCHIVIST", HORIZONTAL_ALIGNMENT_LEFT, -1.0, 10, MUTED)


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_A:
				_toggle_ascii()
			KEY_ENTER, KEY_KP_ENTER:
				_select_nearest_to_player()
			KEY_R, KEY_HOME:
				_reset_view()
			KEY_EQUAL, KEY_PLUS, KEY_KP_ADD:
				_zoom_at(get_viewport_rect().size * 0.5, 1.18)
			KEY_MINUS, KEY_KP_SUBTRACT:
				_zoom_at(get_viewport_rect().size * 0.5, 1.0 / 1.18)
			KEY_F:
				_focus_selected()

	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			_zoom_at(event.position, 1.14)
			get_viewport().set_input_as_handled()
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN and event.pressed:
			_zoom_at(event.position, 1.0 / 1.14)
			get_viewport().set_input_as_handled()
		elif event.button_index == MOUSE_BUTTON_LEFT or event.button_index == MOUSE_BUTTON_MIDDLE:
			if event.pressed:
				dragging = true
				drag_distance = 0.0
				pointer_down_position = event.position
				last_pointer_position = event.position
			else:
				if dragging and drag_distance < 8.0 and event.button_index == MOUSE_BUTTON_LEFT:
					_pick_event_at_screen(event.position)
				dragging = false
			get_viewport().set_input_as_handled()

	if event is InputEventMouseMotion and dragging:
		var delta: Vector2 = event.position - last_pointer_position
		drag_distance += delta.length()
		camera.position -= delta / camera.zoom.x
		_clamp_camera()
		last_pointer_position = event.position
		get_viewport().set_input_as_handled()

	if event is InputEventScreenTouch:
		if event.pressed:
			active_touches[event.index] = event.position
			pointer_down_position = event.position
			last_pointer_position = event.position
			drag_distance = 0.0
			if active_touches.size() == 2:
				previous_pinch_distance = _touch_distance()
		else:
			if active_touches.size() == 1 and drag_distance < 12.0:
				_pick_event_at_screen(event.position)
			active_touches.erase(event.index)
			previous_pinch_distance = 0.0
		get_viewport().set_input_as_handled()

	if event is InputEventScreenDrag:
		active_touches[event.index] = event.position
		drag_distance += event.relative.length()
		if active_touches.size() >= 2:
			var distance := _touch_distance()
			if previous_pinch_distance > 0.0 and distance > 0.0:
				_zoom_at(_touch_center(), clampf(distance / previous_pinch_distance, 0.85, 1.18))
			previous_pinch_distance = distance
		else:
			camera.position -= event.relative / camera.zoom.x
			_clamp_camera()
		get_viewport().set_input_as_handled()


func _pick_event_at_screen(screen_position: Vector2) -> void:
	if not has_loaded:
		return
	var world_position := get_viewport().get_canvas_transform().affine_inverse() * screen_position
	var nearest: Dictionary = {}
	var best_distance := NODE_PICK_RADIUS / maxf(camera.zoom.x, 0.25)
	for item in events:
		var event: Dictionary = item
		var distance := world_position.distance_to(_event_position(event))
		if distance < best_distance:
			best_distance = distance
			nearest = event
	if not nearest.is_empty():
		_select_event(nearest, true)


func _select_nearest_to_player() -> void:
	if not has_loaded:
		return
	var nearest: Dictionary = {}
	var best_distance := INF
	for item in events:
		var event: Dictionary = item
		var distance := player_position.distance_squared_to(_event_position(event))
		if distance < best_distance:
			best_distance = distance
			nearest = event
	if not nearest.is_empty():
		_select_event(nearest, true)


func _select_event(event: Dictionary, move_player: bool) -> void:
	selected_event = event
	player_target_event = event
	if move_player:
		player_position = _event_position(event) + Vector2(0.0, -28.0)
	_update_detail()
	queue_redraw()


func _focus_selected() -> void:
	if selected_event.is_empty():
		return
	camera.position = _event_position(selected_event)
	var new_zoom := clampf(maxf(camera.zoom.x, 0.86), MIN_ZOOM, MAX_ZOOM)
	camera.zoom = Vector2.ONE * new_zoom
	_clamp_camera()


func _zoom_at(screen_position: Vector2, factor: float) -> void:
	var before := get_viewport().get_canvas_transform().affine_inverse() * screen_position
	var target := clampf(camera.zoom.x * factor, MIN_ZOOM, MAX_ZOOM)
	camera.zoom = Vector2.ONE * target
	var after := get_viewport().get_canvas_transform().affine_inverse() * screen_position
	camera.position += before - after
	_clamp_camera()
	_update_status()


func _reset_view() -> void:
	var viewport_size := get_viewport_rect().size
	var usable_size := Vector2(viewport_size.x - 24.0, viewport_size.y - 24.0)
	var fit_zoom := minf(usable_size.x / (WORLD_BOUNDS.size.x + 100.0), usable_size.y / (WORLD_BOUNDS.size.y + 100.0))
	fit_zoom = clampf(fit_zoom, MIN_ZOOM, 0.72)
	camera.zoom = Vector2.ONE * fit_zoom
	camera.position = WORLD_BOUNDS.get_center()
	if has_loaded and not events.is_empty():
		player_position = _event_position(events.front())
	_clamp_camera()
	_update_status()


func _clamp_camera() -> void:
	var margin := 300.0 / maxf(camera.zoom.x, 0.2)
	camera.position.x = clampf(camera.position.x, WORLD_BOUNDS.position.x - margin, WORLD_BOUNDS.end.x + margin)
	camera.position.y = clampf(camera.position.y, WORLD_BOUNDS.position.y - margin, WORLD_BOUNDS.end.y + margin)


func _toggle_ascii() -> void:
	ascii_mode = not ascii_mode
	if ascii_button:
		var is_mobile := get_viewport_rect().size.x < 760.0
		ascii_button.text = (("A+" if ascii_mode else "A") if is_mobile else ("ASCII: ON" if ascii_mode else "ASCII: OFF"))
	_update_status()
	queue_redraw()


func _event_position(event: Dictionary) -> Vector2:
	return Vector2(float(event.get("x_hint", 220.0)), float(event.get("y_hint", 174.0)))


func _event_color(record: Dictionary) -> Color:
	var value := str(record.get("color", "#58f6d0"))
	return Color.from_string(value, ACCENT)


func _touch_distance() -> float:
	var points := active_touches.values()
	if points.size() < 2:
		return 0.0
	return Vector2(points[0]).distance_to(Vector2(points[1]))


func _touch_center() -> Vector2:
	var points := active_touches.values()
	if points.size() < 2:
		return get_viewport_rect().size * 0.5
	return (Vector2(points[0]) + Vector2(points[1])) * 0.5


func _build_hud() -> void:
	top_panel = PanelContainer.new()
	top_panel.name = "TopPanel"
	top_panel.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	top_panel.offset_left = 12.0
	top_panel.offset_top = 12.0
	top_panel.offset_right = -12.0
	top_panel.offset_bottom = 88.0
	top_panel.mouse_filter = Control.MOUSE_FILTER_STOP
	top_panel.add_theme_stylebox_override("panel", _panel_style(Color("0a1613e8"), ACCENT, 2))
	hud.add_child(top_panel)

	top_margin = MarginContainer.new()
	top_margin.add_theme_constant_override("margin_left", 18)
	top_margin.add_theme_constant_override("margin_right", 18)
	top_margin.add_theme_constant_override("margin_top", 10)
	top_margin.add_theme_constant_override("margin_bottom", 10)
	top_panel.add_child(top_margin)

	top_row = HBoxContainer.new()
	top_row.add_theme_constant_override("separation", 10)
	top_margin.add_child(top_row)

	title_stack = VBoxContainer.new()
	title_stack.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top_row.add_child(title_stack)
	title_label = _label("OPENAI PRODUCT ATLAS // 像素檔案地圖", 22, INK)
	title_label.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	title_label.clip_text = true
	title_stack.add_child(title_label)
	status_label = _label("LOADING OFFICIAL RECORDS…", 12, MUTED)
	status_label.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	status_label.clip_text = true
	title_stack.add_child(status_label)

	ascii_button = _button("ASCII: OFF", _toggle_ascii)
	top_row.add_child(ascii_button)
	zoom_out_button = _button("−", func() -> void: _zoom_at(get_viewport_rect().size * 0.5, 1.0 / 1.18))
	top_row.add_child(zoom_out_button)
	zoom_in_button = _button("+", func() -> void: _zoom_at(get_viewport_rect().size * 0.5, 1.18))
	top_row.add_child(zoom_in_button)
	reset_button = _button("RESET", _reset_view)
	top_row.add_child(reset_button)

	detail_panel = PanelContainer.new()
	detail_panel.name = "DetailPanel"
	detail_panel.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	detail_panel.offset_left = 16.0
	detail_panel.offset_top = -260.0
	detail_panel.offset_right = 760.0
	detail_panel.offset_bottom = -16.0
	detail_panel.mouse_filter = Control.MOUSE_FILTER_STOP
	detail_panel.add_theme_stylebox_override("panel", _panel_style(Color("07100ff2"), Color("3a7d73"), 2))
	hud.add_child(detail_panel)

	var detail_margin := MarginContainer.new()
	detail_margin.add_theme_constant_override("margin_left", 18)
	detail_margin.add_theme_constant_override("margin_right", 18)
	detail_margin.add_theme_constant_override("margin_top", 14)
	detail_margin.add_theme_constant_override("margin_bottom", 14)
	detail_panel.add_child(detail_margin)

	var detail_stack := VBoxContainer.new()
	detail_stack.add_theme_constant_override("separation", 5)
	detail_margin.add_child(detail_stack)
	var detail_header := HBoxContainer.new()
	detail_header.add_theme_constant_override("separation", 12)
	detail_stack.add_child(detail_header)
	detail_date = _label("0000-00-00", 14, ALERT)
	detail_header.add_child(detail_date)
	detail_family = _label("ARCHIVE NODE", 14, ACCENT)
	detail_family.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	detail_header.add_child(detail_family)
	detail_title_en = _label("Select a node to inspect its provenance.", 19, INK)
	detail_title_en.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	detail_stack.add_child(detail_title_en)
	detail_title_zh = _label("點選節點以查看來源與中英文事件資訊。", 17, Color("a8d8cf"))
	detail_title_zh.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	detail_stack.add_child(detail_title_zh)
	detail_summary = _label("", 12, Color("9bbab5"))
	detail_summary.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	detail_summary.max_lines_visible = 3
	detail_summary.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	detail_stack.add_child(detail_summary)
	var source_row := HBoxContainer.new()
	source_row.add_theme_constant_override("separation", 10)
	detail_stack.add_child(source_row)
	detail_source = _label("SOURCE // awaiting selection", 11, MUTED)
	detail_source.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	detail_source.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	source_row.add_child(detail_source)
	source_button = _button("OPEN SOURCE ↗", _open_selected_source)
	source_button.disabled = true
	source_row.add_child(source_button)

	help_panel = PanelContainer.new()
	help_panel.name = "HelpPanel"
	help_panel.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	help_panel.offset_left = -430.0
	help_panel.offset_top = -108.0
	help_panel.offset_right = -16.0
	help_panel.offset_bottom = -16.0
	help_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	help_panel.add_theme_stylebox_override("panel", _panel_style(Color("07100fcf"), Color("234e48"), 1))
	hud.add_child(help_panel)
	var help_margin := MarginContainer.new()
	help_margin.add_theme_constant_override("margin_left", 14)
	help_margin.add_theme_constant_override("margin_right", 14)
	help_margin.add_theme_constant_override("margin_top", 10)
	help_margin.add_theme_constant_override("margin_bottom", 10)
	help_panel.add_child(help_margin)
	mobile_help_label = _label("PAN  drag · ZOOM  wheel/pinch/±\nMOVE  WASD/arrows · INSPECT  click/Enter · ASCII  A · RESET  R", 11, MUTED)
	mobile_help_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	help_margin.add_child(mobile_help_label)


func _label(text: String, size: int, color: Color) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_override("font", display_font)
	label.add_theme_font_size_override("font_size", size)
	label.add_theme_color_override("font_color", color)
	return label


func _button(text: String, action: Callable) -> Button:
	var button := Button.new()
	button.text = text
	button.add_theme_font_override("font", display_font)
	button.custom_minimum_size = Vector2(54.0, 46.0)
	button.add_theme_font_size_override("font_size", 12)
	button.add_theme_color_override("font_color", INK)
	button.add_theme_color_override("font_hover_color", Color.WHITE)
	button.add_theme_stylebox_override("normal", _panel_style(Color("0c1b18"), Color("2c5f58"), 2))
	button.add_theme_stylebox_override("hover", _panel_style(Color("15332d"), ACCENT, 2))
	button.add_theme_stylebox_override("pressed", _panel_style(Color("1f473f"), Color.WHITE, 2))
	button.pressed.connect(action)
	return button


func _panel_style(background: Color, border: Color, width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = background
	style.border_color = border
	style.set_border_width_all(width)
	style.corner_radius_top_left = 0
	style.corner_radius_top_right = 0
	style.corner_radius_bottom_left = 0
	style.corner_radius_bottom_right = 0
	return style


func _update_detail() -> void:
	if selected_event.is_empty() or not detail_date:
		return
	detail_date.text = str(selected_event.get("date", "UNKNOWN DATE"))
	detail_family.text = "%s  //  %s" % [str(selected_event.get("map_region", "UNKNOWN REGION")).to_upper(), str(selected_event.get("product", "OPENAI"))]
	detail_title_en.text = str(selected_event.get("title_en", "Untitled release"))
	detail_title_zh.text = str(selected_event.get("title_zh", selected_event.get("title_en", "未命名事件")))
	var summary_zh := str(selected_event.get("summary_zh", ""))
	var summary_en := str(selected_event.get("summary_en", ""))
	detail_summary.text = summary_zh if summary_zh != "" else summary_en
	detail_source.text = "SOURCE // %s" % str(selected_event.get("source_name", "Official OpenAI record"))
	source_button.disabled = str(selected_event.get("source_url", "")) == ""


func _update_status() -> void:
	if not status_label:
		return
	if load_error != "":
		status_label.text = load_error
		status_label.add_theme_color_override("font_color", Color("ff8d96"))
		return
	if not has_loaded:
		status_label.text = "LOADING OFFICIAL RECORDS…"
		return
	var stats: Dictionary = timeline.get("stats", {})
	if get_viewport_rect().size.x < 760.0:
		status_label.text = "%dN / %dL / %dR / %d%% / %s" % [events.size(), int(stats.get("landmarks", 0)), taxonomy.size(), int(camera.zoom.x * 100.0), "ASCII" if ascii_mode else "PIXEL"]
	else:
		status_label.text = "%03d NODES  //  %02d LANDMARKS  //  %02d REGIONS  //  %d%% ZOOM  //  %s MODE" % [events.size(), int(stats.get("landmarks", 0)), taxonomy.size(), int(camera.zoom.x * 100.0), "ASCII" if ascii_mode else "PIXEL"]


func _open_selected_source() -> void:
	if selected_event.is_empty():
		return
	var url := str(selected_event.get("source_url", ""))
	if url.begins_with("https://"):
		OS.shell_open(url)


func _on_viewport_resized() -> void:
	var width := get_viewport_rect().size.x
	var height := get_viewport_rect().size.y
	var is_mobile := width < 760.0
	if top_panel:
		top_panel.offset_left = 8.0 if is_mobile else 12.0
		top_panel.offset_top = 8.0 if is_mobile else 12.0
		top_panel.offset_right = -8.0 if is_mobile else -12.0
		top_panel.offset_bottom = 72.0 if is_mobile else 88.0
	if title_label:
		title_label.add_theme_font_size_override("font_size", 11 if is_mobile else 22)
		title_label.text = "OPENAI // 時間地圖" if is_mobile else "OPENAI PRODUCT ATLAS // 像素檔案地圖"
	if status_label:
		status_label.add_theme_font_size_override("font_size", 8 if is_mobile else 12)
	if title_stack:
		title_stack.custom_minimum_size = Vector2(108.0, 0.0) if is_mobile else Vector2.ZERO
	if top_margin:
		top_margin.add_theme_constant_override("margin_left", 8 if is_mobile else 18)
		top_margin.add_theme_constant_override("margin_right", 8 if is_mobile else 18)
		top_margin.add_theme_constant_override("margin_top", 5 if is_mobile else 10)
		top_margin.add_theme_constant_override("margin_bottom", 5 if is_mobile else 10)
	if top_row:
		top_row.add_theme_constant_override("separation", 4 if is_mobile else 10)
	for button in [ascii_button, zoom_out_button, zoom_in_button, reset_button]:
		if button:
			button.custom_minimum_size = Vector2(34.0, 42.0) if is_mobile else Vector2(54.0, 46.0)
	if ascii_button:
		ascii_button.text = ("A+" if ascii_mode else "A") if is_mobile else ("ASCII: ON" if ascii_mode else "ASCII: OFF")
	if reset_button:
		reset_button.text = "R" if is_mobile else "RESET"
	if detail_panel:
		detail_panel.offset_left = 8.0 if is_mobile else 16.0
		detail_panel.offset_right = width - 8.0 if is_mobile else minf(width - 32.0, 760.0)
		detail_panel.offset_bottom = -8.0 if is_mobile else -16.0
		detail_panel.offset_top = -286.0 if is_mobile else (-300.0 if height < 620.0 else -260.0)
	if detail_title_en:
		detail_title_en.add_theme_font_size_override("font_size", 16 if is_mobile else 19)
	if detail_title_zh:
		detail_title_zh.add_theme_font_size_override("font_size", 14 if is_mobile else 17)
	if help_panel:
		help_panel.visible = not is_mobile
	if mobile_help_label:
		mobile_help_label.text = "DRAG · PINCH · TAP NODE · A ASCII · R RESET" if is_mobile else "PAN  drag · ZOOM  wheel/pinch/±\nMOVE  WASD/arrows · INSPECT  click/Enter · ASCII  A · RESET  R"
	_update_status()
