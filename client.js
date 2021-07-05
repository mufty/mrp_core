//load config
configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

config = JSON.parse(configFile);

let currentCharacter = null;
let currentSpawn = null;
let metadata = {};

let MRP_CLIENT = {
    RandomString: function() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    Notification: function(text, duration) {
        let exec = async () => {
            SetNotificationTextEntry("STRING");
            AddTextComponentString(text);
            let notification = DrawNotification(false, false);
            await MRP_CLIENT.sleep(duration);
            RemoveNotification(notification);
        }
        exec();
    },
    TriggerServerCallback: function(event, args, callback) {
        let requestTS = Date.now() + ":" + MRP_CLIENT.RandomString();
        let responseEvent = event + ":response";
        let serverResponse = function(...serverResponseArgs) {
            let responseTS = serverResponseArgs[serverResponseArgs.length - 1];
            //check if this response is for the callback made
            if (requestTS != responseTS)
                return;

            removeEventListener(responseEvent, serverResponse);
            try {
                callback.call(this, ...serverResponseArgs);
            } catch (e) {
                //TODO this thing throw Error: BUFFER_SHORTAGE for some reason but everything works something to do with wrapped objects in fivem V8
                console.log(e);
                //throw e;
            }
        };
        onNet(responseEvent, serverResponse);
        let source = GetPlayerServerId(PlayerId());
        if (args) {
            let params = [event, source].concat(args);
            params.push(requestTS);
            emitNet.apply(this, params);
        } else
            emitNet(event, source);
    },
    GetPlayerData: function() {
        return currentCharacter;
    },
    getPlayerMetadata: function() {
        return metadata;
    },
    setPlayerMetadata: function(name, state) {
        metadata[name] = state;
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
    },
    drawText3D: function(x, y, z, text) {
        //TODO config not hardcoded magic numbers
        SetTextScale(0.35, 0.35);
        SetTextFont(4);
        SetTextProportional(1);
        SetTextColour(255, 255, 255, 215);
        SetTextEntry("STRING");
        SetTextCentre(true);
        AddTextComponentString(text);
        SetDrawOrigin(x, y, z, 0);
        DrawText(0.0, 0.0);
        let factor = text.length / 370;
        DrawRect(0.0, 0.0 + 0.0125, 0.017 + factor, 0.03, 0, 0, 0, 75);
        ClearDrawOrigin();
    },
    displayHelpText: function(str) {
        BeginTextCommandDisplayHelp("STRING");
        AddTextComponentString(str);
        EndTextCommandDisplayHelp(0, false, true, -1);
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
        //reset metadata
        metadata = {
            isDead: false,
            isCuffed: false,
            isLastStand: false
        };
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
    ClearPedBloodDamage(ped);
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

    if (name == "armor") {
        let ped = PlayerPedId();
        SetPedArmour(ped, currentCharacter.stats.armor);
    }

    if (name == "health") {
        let health = currentCharacter.stats.health;
        if (currentCharacter.sex == "MALE") {
            //because reasons :D
            health += 100;
        }

        let ped = PlayerPedId();
        SetEntityHealth(ped, health);
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
});

onNet('mrp:updateCharacter', (char) => {
    currentCharacter = char;
});

on('mrp:addHealth', (modifier) => {
    addStat('health', modifier);
});

onNet('mrp:addHealth', (modifier) => {
    addStat('health', modifier);
});

if (config.enablePVP) {
    on('playerSpawned', () => {
        setInterval(() => {
            let playerPed = PlayerPedId();

            NetworkSetFriendlyFireOption(true);
            SetCanAttackFriendly(playerPed, true, false);
        }, 0);
    });
}

RegisterNuiCallbackType('revive');
on('__cfx_nui:revive', (data, cb) => {
    emit('mrp:revive');
    cb({});
});

RegisterNuiCallbackType('closeUI');
on('__cfx_nui:closeUI', (data, cb) => {
    SetNuiFocus(false, false);
    cb({});
});

on('mrp:startTimer', (data) => {
    data.type = 'showCounter';
    SendNuiMessage(JSON.stringify(data));
});

onNet('mrp:popup', (data) => {
    SetNuiFocus(true, true);
    data.type = 'showPopup';
    SendNuiMessage(JSON.stringify(data));
});

onNet('mrp:showNotification', msg => {
    MRP_CLIENT.Notification(msg, config.notificationDuration);
});