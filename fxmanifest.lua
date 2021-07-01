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
    'client/ui/scripts/*.js',
    'client/ui/styles/*.css',
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
    'client/mechanics/*.lua',
    'client/mechanics/*.js',
    'client/world/*.js',
    'client/system/*.js',
    'client/system/*.lua',
}

server_scripts {
    'shared/locale.lua',
    'shared/MRPShared.lua',
    'server.js',
}
