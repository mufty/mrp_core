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
}

server_scripts {
	'server.js',
}
