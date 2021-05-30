//load config
configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

config = JSON.parse(configFile);

let currentCharacter = null;
let currentSpawn = null;

let MRP_CLIENT = {
    TriggerServerCallback: function(event, args, callback) {
        let responseEvent = event + ":response";
        let serverResponse = function() {
            removeEventListener(responseEvent, serverResponse);
            callback.apply(null, arguments);
        };
        onNet(responseEvent, serverResponse);
        let source = GetPlayerServerId(PlayerId());
        if (args)
            emitNet.apply(this, [event, source].concat(args));
        else
            emitNet(event, source);
    },
    GetPlayerData: function() {
        return currentCharacter;
    },
    InvokeNative: function() {
        let args = arguments;
        return new Promise(resolve => {
            emit('mrp:lua:invokeNative', args, (returnVal) => {
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
        emit('mrp:lua:createThread', callback);
    },
    sleep: function(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    wait: function(ms) {
        return new Promise((resolve) => {
            emit('mrp:lua:wait', ms, () => {
                resolve();
            });
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
        let pID = PlayerId();
        SetEntityHealth(ped, health);
        SetPedArmour(ped, currentCharacter.stats.armor);
        SetPlayerHealthRechargeMultiplier(pID, config.world.playerHealthRechargeMultiplier);
    });

    emitNet('mrp:characterSpawned', currentCharacter);

    //TODO test only revive for all in menu
    emit('mrp:radial_menu:addMenuItem', {
        id: 'revive',
        text: 'Revive',
        action: 'https://mrp_core/revive'
    });
});

onNet('mrp:revive', () => {
    if (currentCharacter == null)
        return;

    let health = 100;
    currentCharacter.stats.health = health;
    if (currentCharacter.sex == "MALE") {
        //because reasons :D
        health += 100;
    }

    let ped = PlayerPedId();
    let [x, y, z] = GetEntityCoords(ped, true);
    let heading = GetEntityHeading(ped);
    NetworkResurrectLocalPlayer(x, y, z, heading, true, false);
    SetPlayerInvincible(ped, false);
    SetEntityHealth(ped, health);
    SetPedArmour(ped, currentCharacter.stats.armor);
});

function addStat(name, modifier) {
    if (currentCharacter == null)
        return;

    currentCharacter.stats[name] += modifier;

    if (currentCharacter.stats[name] < 0) {
        currentCharacter.stats[name] = 0;
    } else if (currentCharacter.stats[name] > 100) {
        currentCharacter.stats[name] = 100;
    }
}
onNet('mrp:addHunger', (modifier) => {
    addStat('hunger', modifier);
});

onNet('mrp:addThirst', (modifier) => {
    addStat('thirst', modifier);
});

onNet('mrp:addStress', (modifier) => {
    addStat('stress', modifier);
});

onNet('mrp:addArmor', (modifier) => {
    addStat('armor', modifier);

    let ped = PlayerPedId();
    SetPedArmour(ped, currentCharacter.stats.armor);
});

function addHealth(modifier) {
    addStat('health', modifier);

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

if (config.enablePVP) {
    on('playerSpawned', () => {
        setInterval(() => {
            let playerPed = PlayerPedId();

            NetworkSetFriendlyFireOption(true);
            SetCanAttackFriendly(playerPed, true, false);
        }, 0);
    });
}

RegisterCommand('char', function() {
    let config = {
        ped: true,
        headBlend: true,
        faceFeatures: true,
        headOverlays: true,
        components: true,
        props: true
    };
    exports["fivem-appearance"].startPlayerCustomization(appearance => {
        if (appearance) {
            print('Saved');
            print(JSON.stringify(appearance));
        } else {
            print('Canceled');
        }
    }, config);
});

RegisterNuiCallbackType('revive');
on('__cfx_nui:revive', (data, cb) => {
    emit('mrp:revive');
    cb();
});