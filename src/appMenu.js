export function openDeviceHome(state, actor, openMenu) {
  actor.action = 'Using device';
  openMenu(660, 86, 'Device', [
    { label: 'Order Food', run: () => {} },
    { label: 'Shop', run: () => {} },
    { label: 'Music', run: () => {} }
  ]);
}
