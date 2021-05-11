//load config
let configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

let config = JSON.parse(configFile);

let currentCharacter = null;
let currentSpawn = null;

let MRP_CLIENT = {
    GetPlayerData: function() {
        return currentCharacter;
    },
    InvokeNative: function() {
        let args = arguments;
        return new Promise(resolve => {
            emit('mrp:invokeNative', args, (returnVal) => {
                resolve(returnVal);
            });
        });
    }
};

on('mrp:getSharedObject', (cb) => {
    cb(MRP_CLIENT);
});

onNet('mrp:spawn', (char, spawn) => {
    if(!char && currentCharacter) {
        currentCharacter = currentCharacter;
    } else if (char) {
        currentCharacter = char;
        currentSpawn = spawn;
    } else {
        return;
    }

    exports.spawnmanager.spawnPlayer(currentSpawn, () => {
        let health = currentCharacter.stats.health;
        if(currentCharacter.sex == "MALE") {
            //because reasons :D
            health += 100;
        }

        let ped = PlayerPedId();
        SetEntityHealth(ped, health);
        SetPedArmour(ped, currentCharacter.stats.armor);
    });

    emitNet('mrp:characterSpawned', currentCharacter);
});

onNet('mrp:revive', () => {
    if(currentCharacter == null)
        return;

    let health = currentCharacter.stats.health;
    if(currentCharacter.sex == "MALE") {
        //because reasons :D
        health += 100;
    }

    let ped = PlayerPedId();
    SetPlayerInvincible(ped, false);
    SetEntityHealth(ped, health);
    SetPedArmour(ped, currentCharacter.stats.armor);
});
