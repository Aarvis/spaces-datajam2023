
# Schema for GRID 2023

## Requirements For Ad Idea

Player view time calculated through player-damaged-player and player-killed-player

Convert to potential view time and eyeballs

show recent form as View time and eyeballs seen in previous matches and round

Extend the same to Team

### **Tables**

**Team**

- Overall Stats

**Player**

- Name
- Overall Stats

**PlayerGameRoundStats**

- Round Lasted Time
- Player View Time
- Last Person Standing Time
- AceFlag
- ClutchFlag
- kills: 0,
- killAssistsReceived: 0,
- killAssistsGiven: 0,
- killAssistsReceivedFromPlayer: [],
- weaponKills: {},
- teamkills: 0,
- teamkillAssistsReceived: 0,
- teamkillAssistsGiven: 0,
- teamkillAssistsReceivedFromPlayer: [],
- weaponTeamkills: {},
- selfkills: 0,
- deaths: 1,
- structuresDestroyed: 0,
- structuresCaptured: 0,
- objectives: [],
- multikills: [],
- headshots: 0,
- teamHeadshots: 0

**TeamGameRoundStats**

- Round Lasted Time
- Team View Time
- name: 'ECSTATIC'
- side: 'counter-terrorists'
- won: false,
- kills: 2,
- killAssistsReceived: 0,
- killAssistsGiven: 0
- killAssistsReceivedFromPlayer: []
- weaponKills: { usp_silencer: 2 }
- teamkills: 0
- teamkillAssistsReceived: 0
- teamkillAssistsGiven: 0
- teamkillAssistsReceivedFromPlayer: []
- weaponTeamkills: {}
- selfkills: 0
- deaths: 4

**Matches**

- Games[]

**Games/Rounds**

- Round Lasted Time
- Teams[]
- Players[]
- PlayerGameRoundStats[]
- TeamGameRoundStats[]

**Events** - Table for all events in a current match - specifically used for Live scorecard leaderboard 