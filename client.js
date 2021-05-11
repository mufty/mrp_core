//load config
let configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

let config = JSON.parse(configFile);

const spawnPoints = config.spawnPoints;

//load spawnpoints
for(let sp of spawnPoints){
    exports.spawnmanager.addSpawnPoint(sp);
}

let currentCharacter = null;
let currentSpawnId = null;

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

onNet('mrp:spawn', (char, spawnIdx) => {
    if(!char && currentCharacter) {
        currentCharacter = currentCharacter;
        currentSpawnId = spawnIdx;
    } else if (char) {
        currentCharacter = char;
    } else {
        return;
    }

    exports.spawnmanager.spawnPlayer(currentSpawnId, () => {
        let health = currentCharacter.stats.health;
        if(currentCharacter.sex == "MALE") {
            //because reasons :D
            health += 100;
        }

        let ped = PlayerPedId();
        SetEntityHealth(ped, health);
        SetPedArmour(ped, currentCharacter.stats.armor);
    });
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
