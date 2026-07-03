// Low Poly Top Down Wrestling Ring
// Source of truth for the prototype ring asset.
// Units are arbitrary game units.

$fn = 16;

ring_size = 10;
mat_thickness = 0.18;
mat_z = 0;

apron_width = 0.35;
apron_height = 0.28;

rope_count = 3;
rope_radius = 0.045;
rope_spacing = 0.25;
rope_height = 0.62;
rope_offset_from_mat = 0.47;

post_radius = 0.18;
post_height = 0.95;
post_offset = 0.95;
post_cap_height = 0.12;

corner_pad_size = 0.72;
corner_pad_height = 0.22;
corner_pad_z = 0.68;
corner_pad_backing_size = 0.88;
corner_connector_radius = 0.075;

black = [0, 0, 0];
white = [1, 1, 1];

module box_at(pos, size, col) {
  color(col)
    translate(pos)
      cube(size, center = true);
}

module cyl_between(p1, p2, r, col) {
  v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  length = norm(v);
  axis = cross([0, 0, 1], v);
  angle = acos(v[2] / length);

  color(col)
    translate(p1)
      rotate(a = angle, v = axis)
        cylinder(h = length, r = r, center = false);
}

module mat() {
  box_at([0, 0, mat_z], [ring_size, ring_size, mat_thickness], white);

  // black edge lines
  edge = ring_size / 2 + 0.035;
  box_at([0, -edge, mat_z + 0.12], [ring_size + 0.1, 0.07, 0.04], black);
  box_at([0, edge, mat_z + 0.12], [ring_size + 0.1, 0.07, 0.04], black);
  box_at([-edge, 0, mat_z + 0.12], [0.07, ring_size + 0.1, 0.04], black);
  box_at([edge, 0, mat_z + 0.12], [0.07, ring_size + 0.1, 0.04], black);

  // inner sheet line for top down readability
  inner = ring_size / 2 - 0.45;
  box_at([0, -inner, mat_z + 0.13], [inner * 2, 0.035, 0.025], black);
  box_at([0, inner, mat_z + 0.13], [inner * 2, 0.035, 0.025], black);
  box_at([-inner, 0, mat_z + 0.13], [0.035, inner * 2, 0.025], black);
  box_at([inner, 0, mat_z + 0.13], [0.035, inner * 2, 0.025], black);
}

module apron() {
  outer = ring_size / 2 + apron_width / 2;
  box_at([0, -outer, -0.02], [ring_size + apron_width * 2, apron_width, apron_height], black);
  box_at([0, outer, -0.02], [ring_size + apron_width * 2, apron_width, apron_height], black);
  box_at([-outer, 0, -0.02], [apron_width, ring_size + apron_width * 2, apron_height], black);
  box_at([outer, 0, -0.02], [apron_width, ring_size + apron_width * 2, apron_height], black);
}

module ropes() {
  rope_edge = ring_size / 2 + rope_offset_from_mat;
  rope_start = -ring_size / 2 - 0.25;
  rope_end = ring_size / 2 + 0.25;

  for (i = [0 : rope_count - 1]) {
    offset = i * rope_spacing;

    cyl_between([rope_start, -rope_edge - offset, rope_height], [rope_end, -rope_edge - offset, rope_height], rope_radius, black);
    cyl_between([rope_start, rope_edge + offset, rope_height], [rope_end, rope_edge + offset, rope_height], rope_radius, black);

    cyl_between([-rope_edge - offset, rope_start, rope_height], [-rope_edge - offset, rope_end, rope_height], rope_radius, black);
    cyl_between([rope_edge + offset, rope_start, rope_height], [rope_edge + offset, rope_end, rope_height], rope_radius, black);
  }
}

module corner_pad(x_sign, y_sign) {
  cx = x_sign * (ring_size / 2 + 0.35);
  cy = y_sign * (ring_size / 2 + 0.35);

  // black backing creates visible outline from top down
  box_at([cx, cy, corner_pad_z - 0.04], [corner_pad_backing_size, corner_pad_backing_size, corner_pad_height], black);
  box_at([cx, cy, corner_pad_z], [corner_pad_size, corner_pad_size, corner_pad_height], white);

  // diagonal support arm to outer post
  post_x = x_sign * (ring_size / 2 + post_offset);
  post_y = y_sign * (ring_size / 2 + post_offset);
  cyl_between([cx + x_sign * 0.15, cy + y_sign * 0.15, rope_height], [post_x, post_y, rope_height], corner_connector_radius, black);

  // post and cap
  color(black)
    translate([post_x, post_y, post_height / 2 - 0.05])
      cylinder(h = post_height, r = post_radius, center = true);

  color(black)
    translate([post_x, post_y, post_height + 0.45])
      cylinder(h = post_cap_height, r = post_radius * 1.25, center = true);
}

module ring() {
  apron();
  mat();
  ropes();

  for (sx = [-1, 1]) {
    for (sy = [-1, 1]) {
      corner_pad(sx, sy);
    }
  }
}

ring();
