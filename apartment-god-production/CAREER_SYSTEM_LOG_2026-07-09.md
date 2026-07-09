# Apartment God Career System Log, 2026-07-09

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: career system c08fc576557ab7cac27f2da34a7d671c1e434128, state ce7a1c30d63f592e56ec3008319cfe37cb5e8538, travel rewards 81acdb3d6dd37f1b7ff058e3f5f22ad353742af7, phone menu d020191d87ca82fc75d639456b389b896d33858c, autonomy b857424a4e6a29a72f60fb1d3e05f8286927a586 and b170a13132fc813079c4835161013e2fa869027e, HUD ecf29d3413edfae404b5554c66403e494e36c9b3
Files changed: src/careerSystem.js, src/state.js, src/travelLocations.js, src/appMenu.js, src/autonomy.js, src/ui.js, apartment-god-production/CAREER_SYSTEM_LOG_2026-07-09.md
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-career-system-2026-07-09

Summary:
Implemented the first playable Apartment God career system slice. It adds per character jobs, schedules, phone career controls, work shift completion, money, XP, promotions, job perks, and automatic scheduled work departure.

Implementation details:

- Added src/careerSystem.js with five career tracks: Storyboard Artist, Remote Support Lead, Movie Theater Crew, Airline Ground Crew, and Freelance Animator.
- Added per actor career state for Resident and Girlfriend, including track, level, XP, shifts worked, last worked day, warnings, missed shifts, and last pay.
- Connected work completion to career pay, XP, promotion thresholds, stamina, energy, freshness, fun, social, and hunger consequences.
- Connected Movie Theater jobs to free movie ticket perks and Airline jobs to standby vacation ticket perks.
- Added Career / Work to the phone app menu, with status, Work Shift Now, Quit Job, and Apply options.
- Added career HUD text for the selected human character.
- Added autonomy scheduling so employed characters can leave for work during their assigned work window after urgent needs are handled.
- Hardened autonomy trait checks so saved object style traits and future array style traits both work without crashing.

Testing performed:
Code inspection only through GitHub file review. No local or Render browser test performed in this chat.

Testing requested:
After main is updated for Render testing, test boot, reset, Cell > Career / Work, applying different jobs, Work Shift Now, scheduled automatic work around 8 AM to 9 AM, vehicle departure and return, pay gain, career HUD update, promotion progress, and house playability when one character leaves for work.

Known risks:
This touches autonomy, phone menu, offsite travel rewards, and state. Work travel still uses the existing vehicle departure and return path, so any vehicle routing issue can affect work. Shift duration currently uses the existing Work Shift destination duration rather than a separate per career duration. It is not browser verified.

Follow ups:
Append this same entry into apartment-god-production/ONGOING_DESIGN_LOG.md when safe to rewrite the full large file without risking history loss, then add missed shift consequences, job specific work scenes, laptop specific job search UI, quitting penalties, and relationship or mood reactions to working too much.
