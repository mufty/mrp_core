fx_version 'cerulean'
game 'gta5'

author 'mufty'
description 'MRP core module'
version '0.0.1'

files {
    'shared/debug.js',
    'config/client.json',
}

client_scripts {
    'client/utils.lua',
    'client.js',
    'client/noclip.lua',
    'client/mechanics/fingerpointing.lua',
    'client/mechanics/tackle.js',
    'client/world/npc_control.js',
    'client/world/radio.js',
    'client/world/vehicleRadar.js',
    'client/system/persistentCharacter.js',
    'client/system/hungerThirstDecay.js',
    'client/system/stress.js',
    'client/system/main.lua',
}

server_scripts {
    'server.js',
}
