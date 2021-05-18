MRP = {
    playerSpawnedCharacters: {}
};
ENTITIES = 0;

const config = require('./config/default.json');
const logger = require('./shared/debug.js');
const db = require('./server/db.js');
const commands = require('./server/commands.js');

var connectedUsers = {};

MRP.getFivemId = function(source) {
    let numOfIdentifiers = GetNumPlayerIdentifiers(source);
    let fivemID;
    for (let i = 0; i < numOfIdentifiers; i++) {
        const identifier = GetPlayerIdentifier(source, i);

        if (identifier.includes('fivem:')) {
            fivemID = identifier.slice(6);
        }
    }

    return fivemID;
};

MRP.getPlayersServer = function() {
    let num = GetNumPlayerIndices();
    let players = [];
    for (i = 0; i < num; i++) {
        players.push({
            id: num,
            identifier: GetPlayerIdentifier(num),
            name: GetPlayerName(num)
        });
    }
    return players;
};

MRP.getEntityPosition = function(source) {
    let retVal = [];
    let plyPed = GetPlayerPed(source);
    let plyPos = GetEntityCoords(plyPed);
    let plyHeading = GetEntityHeading(plyPed);

    if (plyPos && plyHeading) {
        retVal = [plyPos[0], plyPos[1], plyPos[2], plyHeading];
    }

    return retVal;
};

var getConnectedUsers = () => connectedUsers;

on('mrp:getSharedObject', (cb) => {
    cb(MRP);
});

onNet('mrp:characterSpawned', (char) => {
    //TODO
});

on('onResourceStart', (resource) => {
    let resName = GetCurrentResourceName();
    if (resName != resource)
        return;

    let players = MRP.getPlayersServer();
    for (let player of players) {
        let fivemID = MRP.getFivemId(player.id + "");
        if (fivemID) {
            emit('mrp:userLogin', player.name, player, fivemID);
        }
    }
});

on('playerConnecting', (playerName, setKickReason, deferrals) => {
    deferrals.defer();

    let player = global.source;

    deferrals.update(`Hello ${playerName}. Your steam ID is being checked.`)

    logger.log(`Player connecting: ${playerName}`);

    let fivemID = MRP.getFivemId(player);

    deferrals.done();

    if (fivemID) {
        emit('mrp:userLogin', playerName, player, fivemID);
    }
});

on('onResourceStop', (resource) => {
    if (resource == GetCurrentResourceName()) {
        //TODO despawn characters to prevent "ghost" characters from running around
    }
});

on('mrp:userJoined', (user) => {
    connectedUsers[user._id] = user;
});

on("playerDropped", (reason) => {
    let source = global.source;

    logger.log(`Player ${GetPlayerName(source)} dropped (Reason: ${reason}).`)

    let fivemID = MRP.getFivemId(source);
    if (fivemID) {
        delete connectedUsers[fivemID];
    }
});

onNet('mrp:server:tacklePlayer', (tackled, forvardVector, tackler) => {
    emitNet('mrp:client:tacklePlayer', tackled, forvardVector, tackler);
});

onNet('mrp:fetchCharacters', (source) => {
    let execute = async function() {
        let characters = await MRP.getCharacters(source);
        emitNet('mrp:client:fetchCharacters', source, characters);
    };
    execute();
});

onNet('mrp:useCharacter', (source, characterToUse) => {
    if (!characterToUse)
        return;

    let objId = MRP.toObjectId(characterToUse._id.id);
    characterToUse._id = objId;

    //convert timestamp
    characterToUse.birthday = MRP.toMongoTimestamp(characterToUse.birthday);

    characterToUse.entityID = ENTITIES++;
    let update = async function() {
        let updatedUser = await MRP.setLastUsedCharacter(source, characterToUse);
        let users = MRP.getConnectedUsers();
        users[updatedUser._id] = updatedUser;
    };
    update();
    let spawnPoint = {};
    Object.assign(spawnPoint, config.spawnPoints[0]);
    spawnPoint.model = characterToUse.model;
    MRP.playerSpawnedCharacters[source] = characterToUse;
    emitNet('mrp:spawn', source, characterToUse, spawnPoint);
    emit('mrp:spawn', source, characterToUse, spawnPoint);
});

MRP.log = logger.log;
MRP.getConnectedUsers = getConnectedUsers;
/*exports('log', logger.log);
exports('getConnectedUsers', getConnectedUsers);*/