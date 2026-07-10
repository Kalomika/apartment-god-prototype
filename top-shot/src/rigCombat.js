export const RIG_JOINTS = [
  'root','torso','head','pelvis',
  'leftShoulder','leftElbow','leftHand','rightShoulder','rightElbow','rightHand',
  'leftHip','leftKnee','leftFoot','rightHip','rightKnee','rightFoot',
  'weaponSocket','backSocket'
];

export const POSE_GROUPS = {
  locomotion: ['idle','walk','run','sprint','crouchWalk','proneCrawl','roll','dive','stagger','limp'],
  standingCqc: ['leftJab','rightCross','leftHook','rightHook','leftElbow','rightElbow','leftKnee','rightKnee','leftKick','rightKick'],
  defense: ['leftHighBlock','rightHighBlock','leftLowBlock','rightLowBlock','leftParry','rightParry','duck','slipLeft','slipRight','backStep'],
  grappling: ['clinch','bodyLock','singleLeg','doubleLeg','sprawl','trip','throw','mount','sideControl','guard','escape'],
  submissions: ['armLock','legLock','choke','wristControl']
};

export const MOVE_LIBRARY = {
  leftJab: move('leftJab','leftHand','rightHighBlock',36,6,0.18,0.18,0.22),
  rightCross: move('rightCross','rightHand','leftHighBlock',42,9,0.22,0.2,0.28),
  leftHook: move('leftHook','leftHand','rightParry',38,10,0.25,0.18,0.32),
  rightHook: move('rightHook','rightHand','leftParry',38,10,0.25,0.18,0.32),
  leftElbow: move('leftElbow','leftElbow','rightHighBlock',24,12,0.16,0.16,0.3),
  rightElbow: move('rightElbow','rightElbow','leftHighBlock',24,12,0.16,0.16,0.3),
  leftKnee: move('leftKnee','leftKnee','rightLowBlock',22,14,0.22,0.2,0.36),
  rightKnee: move('rightKnee','rightKnee','leftLowBlock',22,14,0.22,0.2,0.36),
  leftKick: move('leftKick','leftFoot','rightLowBlock',58,13,0.28,0.18,0.42),
  rightKick: move('rightKick','rightFoot','leftLowBlock',58,13,0.28,0.18,0.42),
  takedown: move('takedown','torso','sprawl',30,8,0.28,0.32,0.6),
  throw: move('throw','root','balanceStep',34,10,0.2,0.28,0.55),
  armLock: move('armLock','leftHand','escape',18,0,0.3,0.7,0.5),
  legLock: move('legLock','leftHand','escape',20,0,0.3,0.8,0.5),
  choke: move('choke','rightHand','handFight',18,0,0.25,0.9,0.5)
};

export const BLOCK_MAP = {
  leftJab: ['rightHighBlock','rightParry','slipRight','backStep'],
  rightCross: ['leftHighBlock','leftParry','slipLeft','backStep'],
  leftHook: ['rightHighBlock','duck','backStep'],
  rightHook: ['leftHighBlock','duck','backStep'],
  leftElbow: ['rightHighBlock','clinchFrame'],
  rightElbow: ['leftHighBlock','clinchFrame'],
  leftKnee: ['rightLowBlock','hipFrame','backStep'],
  rightKnee: ['leftLowBlock','hipFrame','backStep'],
  leftKick: ['rightLowBlock','backStep','roll'],
  rightKick: ['leftLowBlock','backStep','roll'],
  takedown: ['sprawl','sideStep','kneeFrame'],
  throw: ['balanceStep','hipFrame'],
  armLock: ['handFight','rollThrough','stackEscape'],
  legLock: ['bootPull','turnKnee','handFight'],
  choke: ['twoOnOne','chinTuck','rollThrough']
};

export const RUN_POSE_NOTES = {
  shoulders: 'wide oval shoulder mass with head nested into it',
  stride: 'opposite arm and leg drive forward, rear knee bends visibly',
  head: 'small head ellipse offset into direction of travel',
  hands: 'small fist marks, not tentacle ends',
  feet: 'clear black or dark foot ovals, one forward and one trailing'
};

export const GROUND_POSE_NOTES = {
  connection: 'two bodies must visually interlock at hand, wrist, hip, knee, ankle, or neck control points',
  legLock: 'attacker body angled across opponent leg with both hands controlling ankle or knee line',
  armLock: 'attacker hips near shoulder line, both hands isolating wrist or elbow',
  mount: 'top fighter torso over bottom fighter chest or hips, knees outside body line',
  escape: 'bottom fighter rotates hips, frames with forearm, or posts a foot to create space'
};

function move(id, limb, primaryDefense, reach, damage, startup, active, recovery) {
  return { id, limb, primaryDefense, reach, damage, startup, active, recovery };
}
