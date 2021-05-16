//load config
configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

config = JSON.parse(configFile);

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
    },

    /**
     * Example with infinite while cycle:
     * MRP_CLIENT.CreateThread(()=>{
     *      let cycle = async function(){
     *          let x = 0;
     *          while(true){
     *              x++;
     *              print(x);
     *              await MRP_CLIENT.sleep(2000);
     *          }
     *      }
     *      cycle();
     * });
     */
    CreateThread: function(callback) {
        emit('mrp:createThread', callback);
    },
    sleep: function(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
};

on('mrp:getSharedObject', (cb) => {
    cb(MRP_CLIENT);
});

onNet('mrp:spawn', (char, spawn) => {
    if (!char && currentCharacter) {
        currentCharacter = currentCharacter;
    } else if (char) {
        currentCharacter = char;
        currentSpawn = spawn;
    } else {
        return;
    }

    let health = currentCharacter.stats.health;
    if (currentCharacter.sex == "MALE") {
        //because reasons :D
        health += 100;
    }

    exports.spawnmanager.spawnPlayer(currentSpawn, () => {
        let ped = PlayerPedId();
        SetEntityHealth(ped, health);
        SetPedArmour(ped, currentCharacter.stats.armor);
        SetPlayerHealthRechargeMultiplier(ped, config.world.playerHealthRechargeMultiplier);
    });

    emitNet('mrp:characterSpawned', currentCharacter);
});

onNet('mrp:revive', () => {
    if (currentCharacter == null)
        return;

    let health = 100;
    if (currentCharacter.sex == "MALE") {
        //because reasons :D
        health += 100;
    }

    currentCharacter.stats.health = health;

    let ped = PlayerPedId();
    let [x, y, z] = GetEntityCoords(ped, true);
    let heading = GetEntityHeading(ped);
    NetworkResurrectLocalPlayer(x, y, z, heading, true, false);
    SetPlayerInvincible(ped, false);
    SetEntityHealth(ped, health);
    SetPedArmour(ped, currentCharacter.stats.armor);
});

onNet('mrp:addHunger', (modifier) => {
    if (currentCharacter == null)
        return;

    currentCharacter.stats.hunger += modifier;
});

onNet('mrp:addThirst', (modifier) => {
    if (currentCharacter == null)
        return;

    currentCharacter.stats.thirst += modifier;
});

onNet('mrp:addStress', (modifier) => {
    if (currentCharacter == null)
        return;

    currentCharacter.stats.stress += modifier;
});

onNet('mrp:addArmor', (modifier) => {
    if (currentCharacter == null)
        return;

    currentCharacter.stats.armor += modifier;

    let ped = PlayerPedId();
    SetPedArmour(ped, currentCharacter.stats.armor);
});

function addHealth(modifier) {
    if (currentCharacter == null)
        return;

    currentCharacter.stats.health += modifier;
    if (currentCharacter.stats.health < 0) {
        currentCharacter.stats.health = 0;
    } else if (currentCharacter.stats.health > 100) {
        currentCharacter.stats.health = 100;
    }

    let health = currentCharacter.stats.health;
    if (currentCharacter.sex == "MALE") {
        //because reasons :D
        health += 100;
    }

    let ped = PlayerPedId();
    SetEntityHealth(ped, health);
}

on('mrp:addHealth', addHealth);
onNet('mrp:addHealth', addHealth);