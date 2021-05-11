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

Includes noclip from: https://github.com/MiiMii1205/noclipper
