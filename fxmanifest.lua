fx_version 'cerulean'
game 'gta5'

author 'mufty'
description 'MRP core module'
version '0.0.1'

dependencies {
    "yarn"
}

ui_page 'client/ui/index.html'

files {
    'config/client.json',
    'client/helpers.js',
    'client/ui/fonts/coolvetica_rg.ttf',
    'client/ui/scripts/hud.js',
    'client/ui/styles/style.css',
    'client/ui/index.html',
}

client_scripts {
    'shared/debug.js',
    'shared/locale.lua',
    'shared/MRPShared.lua',
    'client/entityEnumerator.lua',
    'client/utils.lua',
    'client.js',
    'client/noclip.lua',
    'client/mechanics/fingerpointing.lua',
    'client/mechanics/tackle.js',
    'client/mechanics/gamertags.js',
    'client/world/npc_control.js',
    'client/world/radio.js',
    'client/world/vehicleRadar.js',
    'client/system/persistentCharacter.js',
    'client/system/hungerThirstDecay.js',
    'client/system/stress.js',
    'client/system/main.lua',
}

server_scripts {
    'shared/locale.lua',
    'shared/MRPShared.lua',
    'server.js',
}
