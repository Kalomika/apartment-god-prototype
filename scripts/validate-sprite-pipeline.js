import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { z } from 'zod';

const root = process.cwd();
const manifestPath = join(root, 'assets', 'manifests', 'sprite-pipeline.json');
const schemaOnly = process.argv.includes('--schema-only');

const FrameSchema = z.object({
  id: z.string().min(1),
  file: z.string().min(1).optional(),
  duration_ms: z.number().positive().optional(),
  tags: z.array(z.string()).default([])
});

const AnimationSchema = z.object({
  state_id: z.string().min(1),
  category: z.string().min(1),
  character_type: z.string().min(1).optional(),
  action_name: z.string().min(1),
  frame_count: z.number().int().nonnegative(),
  frame_logic: z.enum(['enter_hold_exit', 'loop', 'random_hold', 'single', 'directional_cycle']),
  frames: z.array(FrameSchema),
  loop: z.boolean().default(false),
  anchor: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }),
  scale: z.number().positive().default(1),
  status: z.enum(['planned', 'placeholder', 'review', 'production']).default('planned'),
  notes: z.string().default('')
});

const SpriteSchema = z.object({
  id: z.string().min(1),
  kind: z.string().min(1),
  role: z.string().min(1),
  file: z.string().min(1).optional(),
  anchor: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }),
  scale: z.number().positive().default(1),
  status: z.enum(['planned', 'placeholder', 'review', 'production']).default('planned'),
  notes: z.string().default('')
});

const ManifestSchema = z.object({
  version: z.number().int().positive(),
  style_target: z.string().min(1),
  forbidden_looks: z.array(z.string()).min(1),
  atlas: z.object({
    image: z.string().min(1),
    json: z.string().min(1),
    padding: z.number().int().nonnegative(),
    max_size: z.number().int().positive()
  }),
  animations: z.array(AnimationSchema),
  sprites: z.array(SpriteSchema)
});

if (!existsSync(manifestPath)) {
  console.error(`Missing sprite pipeline manifest: ${manifestPath}`);
  process.exit(1);
}

const manifest = ManifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')));
const errors = [];

for (const animation of manifest.animations) {
  if (animation.frame_count !== animation.frames.length) {
    errors.push(`${animation.state_id}: frame_count ${animation.frame_count} does not match frames length ${animation.frames.length}`);
  }
  for (const frame of animation.frames) {
    if (!frame.file || schemaOnly) continue;
    const absolute = join(root, frame.file);
    if (animation.status === 'production' && !existsSync(absolute)) errors.push(`${animation.state_id}: missing production frame ${frame.file}`);
  }
}

for (const sprite of manifest.sprites) {
  if (!sprite.file || schemaOnly) continue;
  const absolute = join(root, sprite.file);
  if (sprite.status === 'production' && !existsSync(absolute)) errors.push(`${sprite.id}: missing production sprite ${sprite.file}`);
}

if (errors.length) {
  console.error('Sprite pipeline validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Sprite pipeline valid: ${manifest.animations.length} animation states, ${manifest.sprites.length} sprite specs.`);
