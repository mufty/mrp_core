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
    sleep: function(ms){
        return new Promise((resolve)=>{
            setTimeout(resolve, ms);
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
