# mrp_core

## Dependencies

- MongoDB - https://www.mongodb.com

## Installation

- checkout using git

```bash
cd resources
git clone https://github.com/mufty/mrp_core.git [mrp]/mrp_core
```

- add mrp_core to your server.cfg

```bash
ensure mrp_core
```

## Configuration

Example of minimal configuration for server.cfg modules

```bash
stop webadmin

ensure mapmanager
ensure chat
ensure spawnmanager
ensure sessionmanager
ensure baseevents

ensure mrp_core
```

convars in server.cfg

setr mrp:hideHudComps "6,7,9"

With this ^ you can disable the default hud components. The whole list:

1 : WANTED_STARS
2 : WEAPON_ICON
3 : CASH
4 : MP_CASH
5 : MP_MESSAGE
6 : VEHICLE_NAME
7 : AREA_NAME
8 : VEHICLE_CLASS
9 : STREET_NAME
10 : HELP_TEXT
11 : FLOATING_HELP_TEXT_1
12 : FLOATING_HELP_TEXT_2
13 : CASH_CHANGE
14 : RETICLE
15 : SUBTITLE_TEXT
16 : RADIO_STATIONS
17 : SAVING_GAME
18 : GAME_STREAM
19 : WEAPON_WHEEL
20 : WEAPON_WHEEL_STATS
21 : HUD_COMPONENTS
22 : HUD_WEAPONS


## Usage

By default when logged in the user doesn't spawn. Because there are no characters for the user. So to spawn you need to create a character with the provided command with two mandatory arguments in name and surname:

```bash
/createCharacter Name Surname
```

After creating a character you can "use" it to spawn as that character with another command:

```bash
/useCharacter Name Surname
```

There is also a command for listing characters:

```bash
/listCharacters
```

Other usefull commands:

```bash
/respawn
/revive
/pos
```

## In-game features

- fingerpointing (B)
- tackle while running (E)

Includes noclip from: https://github.com/MiiMii1205/noclipper

## Server config

Features:
- npc spawning controlls
- turn off/on cops
- turn off/on wanted levels
- enable/disable vehicle radio
