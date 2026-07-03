// Low Poly Powerhouse Wrestler Proxy
// Early source asset for top down gameplay testing.
// Built from primitives so the body type and pose can be tuned with variables.

$fn = 16;

// Body controls
body_height = 2.15;
shoulder_width = 1.55;
chest_depth = 0.72;
chest_height = 0.48;
hip_width = 0.92;
hip_depth = 0.50;

head_radius_x = 0.28;
head_radius_y = 0.22;
head_radius_z = 0.32;

arm_radius = 0.16;
forearm_radius = 0.14;
leg_radius = 0.20;
shin_radius = 0.16;
hand_radius = 0.15;

stance_width = 0.95;
ready_arm_spread = 1.10;
ready_arm_forward = 0.72;

black = [0, 0, 0];
white = [0.93, 0.93, 0.93];
gray = [0.70, 0.70, 0.70];

module scaled_sphere(pos, scale_values, col) {
  color(col)
    translate(pos)
      scale(scale_values)
        sphere(r = 1);
}

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

module capsule(p1, p2, r, col) {
  cyl_between(p1, p2, r, col);
  scaled_sphere(p1, [r, r, r], col);
  scaled_sphere(p2, [r, r, r], col);
}

module wrestler_powerhouse_ready() {
  // Torso, pelvis, head
  scaled_sphere([0, 0.00, 1.55], [shoulder_width / 2, chest_depth / 2, chest_height], white);
  scaled_sphere([0, 0.20, 1.10], [hip_width / 2, hip_depth / 2, 0.26], gray);
  capsule([0, -0.06, 1.82], [0, -0.10, 2.04], 0.13, white);
  scaled_sphere([0, -0.18, 2.28], [head_radius_x, head_radius_y, head_radius_z], white);
  scaled_sphere([0, -0.31, 2.50], [0.31, 0.18, 0.10], black);

  // Chest and waist line details, real raised geometry
  box_at([0, 0.03, 1.78], [0.035, 0.42, 0.035], black);
  box_at([0, 0.24, 1.25], [0.66, 0.045, 0.035], black);

  // Left arm
  capsule([-0.58, 0.00, 1.55], [-ready_arm_spread, 0.25, 1.34], arm_radius, white);
  capsule([-ready_arm_spread, 0.25, 1.34], [-0.95, ready_arm_forward, 1.16], forearm_radius, white);
  scaled_sphere([-0.92, ready_arm_forward + 0.18, 1.08], [hand_radius, hand_radius * 0.75, hand_radius * 0.55], white);
  capsule([-0.98, 0.54, 1.22], [-0.95, 0.70, 1.14], forearm_radius * 1.05, gray);

  // Right arm
  capsule([0.58, 0.00, 1.55], [ready_arm_spread, 0.25, 1.34], arm_radius, white);
  capsule([ready_arm_spread, 0.25, 1.34], [0.95, ready_arm_forward, 1.16], forearm_radius, white);
  scaled_sphere([0.92, ready_arm_forward + 0.18, 1.08], [hand_radius, hand_radius * 0.75, hand_radius * 0.55], white);
  capsule([0.98, 0.54, 1.22], [0.95, 0.70, 1.14], forearm_radius * 1.05, gray);

  // Legs
  capsule([-stance_width / 3, 0.36, 0.98], [-stance_width / 2, 0.92, 0.58], leg_radius, white);
  capsule([stance_width / 3, 0.36, 0.98], [stance_width / 2, 0.92, 0.58], leg_radius, white);

  scaled_sphere([-stance_width / 2, 0.94, 0.56], [0.25, 0.16, 0.12], gray);
  scaled_sphere([stance_width / 2, 0.94, 0.56], [0.25, 0.16, 0.12], gray);

  capsule([-stance_width / 2, 1.03, 0.47], [-stance_width / 2 - 0.15, 1.46, 0.16], shin_radius, white);
  capsule([stance_width / 2, 1.03, 0.47], [stance_width / 2 + 0.15, 1.46, 0.16], shin_radius, white);

  scaled_sphere([-stance_width / 2 - 0.20, 1.62, 0.11], [0.22, 0.34, 0.11], gray);
  scaled_sphere([stance_width / 2 + 0.20, 1.62, 0.11], [0.22, 0.34, 0.11], gray);

  // Simple boot lace strips
  box_at([-stance_width / 2 - 0.20, 1.63, 0.24], [0.26, 0.035, 0.035], black);
  box_at([stance_width / 2 + 0.20, 1.63, 0.24], [0.26, 0.035, 0.035], black);
}

wrestler_powerhouse_ready();
