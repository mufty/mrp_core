MRP = {
    playerSpawnedCharacters: {}
};
ENTITIES = 0;

const config = require('./config/default.json');
const logger = require('./shared/debug.js');
const db = require('./server/db.js');
const commands = require('./server/commands.js');

var connectedUsers = {};

MRP.getUserId = function(source) {
    let numOfIdentifiers = GetNumPlayerIdentifiers(source);
    let userID;
    for (let i = 0; i < numOfIdentifiers; i++) {
        const identifier = GetPlayerIdentifier(source, i);

        if (identifier.includes('fivem:')) {
            userID = identifier.slice(6);
        }
    }

    if (!userID) {
        //don't have fivem suplement with steam
        for (let i = 0; i < numOfIdentifiers; i++) {
            const identifier = GetPlayerIdentifier(source, i);

            if (identifier.includes('steam:')) {
                userID = identifier.slice(6);
            }
        }
    }

    if (!userID) {
        //don't have fivem suplement with license
        for (let i = 0; i < numOfIdentifiers; i++) {
            const identifier = GetPlayerIdentifier(source, i);

            if (identifier.includes('license:')) {
                userID = identifier.slice(8);
            }
        }
    }


    return userID;
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

MRP.getSpawnedCharacter = function(source) {
    return MRP.playerSpawnedCharacters[source];
};

MRP.updateSpawnedChar = function(source, char) {
    MRP.playerSpawnedCharacters[source] = char;
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

MRP.isObjectIDEqual = function(id1, id2) {
    if (!id1 || !id2 || !id1.id || !id2.id)
        return false;

    let bufferArr = [];
    for (let i in id1.id) {
        bufferArr.push(id1.id[i]);
    }

    let idHash1 = Buffer.from(bufferArr).toString();

    bufferArr = [];
    for (let i in id2.id) {
        bufferArr.push(id2.id[i]);
    }

    let idHash2 = Buffer.from(bufferArr).toString();

    if (idHash1 == idHash2)
        return true;

    return false;
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
        let userID = MRP.getUserId(player.id + "");
        if (userID) {
            emit('mrp:userLogin', player.name, player, userID);
        }
    }
});

on('playerConnecting', (playerName, setKickReason, deferrals) => {
    deferrals.defer();

    let player = global.source;

    deferrals.update(`Hello ${playerName}. Your steam ID is being checked.`)

    logger.log(`Player connecting: ${playerName}`);

    let userID = MRP.getUserId(player);

    deferrals.done();

    if (userID) {
        emit('mrp:userLogin', playerName, player, userID);
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

    let userID = MRP.getUserId(source);
    if (userID) {
        delete connectedUsers[userID];
    }
});

onNet('mrp:server:tacklePlayer', (tackled, forvardVector, tackler) => {
    console.log(`SERVER: tackled [${tackled}] forvardVector [${forvardVector}] tackler [${tackler}]`);
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

RegisterCommand('stateId', (source) => {
    let char = MRP.getSpawnedCharacter(source);
    if (char) {
        emitNet('chat:addMessage', source, {
            color: [255, 255, 255],
            multiline: true,
            args: [`Your state ID is: ${char.stateId}`]
        });
    }
});

MRP.log = logger.log;
MRP.getConnectedUsers = getConnectedUsers;

exports('log', logger.log);
exports('DBCreate', db.create);
exports('DBRead', db.read);
exports('toObjectId', MRP.toObjectId);
//exports('getConnectedUsers', getConnectedUsers);