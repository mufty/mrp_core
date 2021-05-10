MRP = {};

const config = require('./config/default.json');
const logger = require('./shared/debug.js');
const db = require('./server/db.js');
const commands = require('./server/commands.js');

var connectedUsers = {};

MRP.getFivemId = function(source){
    let numOfIdentifiers = GetNumPlayerIdentifiers(source);
    let fivemID;
    for(let i = 0; i < numOfIdentifiers; i++) {
        const identifier = GetPlayerIdentifier(source, i);

        if(identifier.includes('fivem:')){
            fivemID = identifier.slice(6);
        }
    }

    return fivemID;
};

var getConnectedUsers = () => connectedUsers;

on('onResourceStart', (resource) => {
    //TODO fill connectedUsers when mrp_core starts
    /*
    for _, playerId in ipairs(GetPlayers()) do
      local name = GetPlayerName(playerId)
      print(('Player %s with id %i is in the server'):format(name, playerId))
      -- ('%s'):format('text') is same as string.format('%s', 'text)
    end
    */
});

on('playerConnecting', (playerName, setKickReason, deferrals) => {
    deferrals.defer();

    let player = global.source;

    deferrals.update(`Hello ${playerName}. Your steam ID is being checked.`)

    logger.log(`Player connecting: ${playerName}`);

    let fivemID = MRP.getFivemId(player);

    deferrals.done();

    if(fivemID) {
        emit('mrp:userLogin', playerName, player, fivemID);
    }
});

on('mrp:userJoined', (user) => {
    connectedUsers[user._id] = user;
});

on("playerDropped", (reason) => {
    let source = global.source;

    logger.log(`Player ${GetPlayerName(source)} dropped (Reason: ${reason}).`)

    let fivemID = MRP.getFivemId(source);
    if(fivemID) {
        delete connectedUsers[fivemID];
    }
});

MRP.log = logger.log;
MRP.getConnectedUsers = getConnectedUsers;
/*exports('log', logger.log);
exports('getConnectedUsers', getConnectedUsers);*/
