//load config
configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

config = JSON.parse(configFile);

let currentCharacter = null;
let currentSpawn = null;
let metadata = {};

/**
 * @namespace MRP_CLIENT
 */
let MRP_CLIENT = {

    /**    
     * RandomString - description    
     *      
     * @memberof MRP_CLIENT
     * @return {type}  description     
     */
    RandomString: function() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },


    /**    
     * Notification - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} text     description     
     * @param  {type} duration description     
     * @return {type}          description     
     */
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

    /**    
     * TriggerServerCallback - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} event    description     
     * @param  {type} args     description     
     * @param  {type} callback description     
     * @return {type}          description     
     */
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

    /**    
     * GetPlayerData - description    
     *      
     * @memberof MRP_CLIENT
     * @return {type}  description     
     */
    GetPlayerData: function() {
        return currentCharacter;
    },

    /**    
     * getPlayerMetadata - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} name description     
     * @return {type}      description     
     */
    getPlayerMetadata: function(name) {
        if (name)
            return metadata[name];

        return metadata;
    },

    /**    
     * setPlayerMetadata - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} name  description     
     * @param  {type} state description     
     * @return {type}       description     
     */
    setPlayerMetadata: function(name, state) {
        metadata[name] = state;
    },

    /**    
     * InvokeNative - description    
     *      
     * @memberof MRP_CLIENT
     * @return {type}  description     
     */
    InvokeNative: function() {
        let args = arguments;
        return new Promise(resolve => {
            emit('mrp:lua:invokeNative', args, (returnVal) => {
                resolve(returnVal);
            });
        });
    },

    /**
     * portToLocation - description    
     *      
     * @param  {type} ped
     * @param  {type} location {x, y, z, heading}
     */
    portToLocation: function(ped, location) {
        SetEntityCoords(ped, location.x, location.y, location.z, true, false, false, false);
        SetEntityHeading(ped, location.heading);
    },

    /**     
     * CreateThread - description    
     * 
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
     *      
     * @memberof MRP_CLIENT
     * @param  {type} callback description     
     * @return {type}          description     
     */
    CreateThread: function(callback) {
        emit('mrp:lua:createThread', callback);
    },

    /**    
     * sleep - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} ms description     
     * @return {type}    description     
     */
    sleep: function(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },

    /**    
     * wait - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} ms description     
     * @return {type}    description     
     */
    wait: function(ms) {
        return new Promise((resolve) => {
            emit('mrp:lua:wait', ms, () => {
                resolve();
            });
        });
    },

    /**    
     * drawText3D - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} x    description     
     * @param  {type} y    description     
     * @param  {type} z    description     
     * @param  {type} text description     
     * @return {type}      description     
     */
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

    /**    
     * displayHelpText - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} str description     
     * @return {type}     description     
     */
    displayHelpText: function(str) {
        BeginTextCommandDisplayHelp("STRING");
        AddTextComponentString(str);
        EndTextCommandDisplayHelp(0, false, true, -1);
    },

    /**    
     * isNearLocation - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} entity description     
     * @param  {type} x      description     
     * @param  {type} y      description     
     * @param  {type} z      description     
     * @param  {type} area   description     
     * @return {type}        description     
     */
    isNearLocation: function(entity, x, y, z, area) {
        if (!area) {
            area = config.defaultNearArea;
        }

        let [entityX, entityY, entityZ] = GetEntityCoords(entity);
        let distance = Vdist(entityX, entityY, entityZ, x, y, z);
        return distance <= area;
    },

    /**    
     * getEntityInFront - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} flags description     
     * @return {type}       description     
     */
    getEntityInFront: function(flags) {
        let [plyCoordsX, plyCoordsY, plyCoordsZ] = GetEntityCoords(PlayerPedId(), false);
        let [plyOffsetX, plyOffsetY, plyOffsetZ] = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 1.2, 0.0);
        let rayHandle = StartShapeTestCapsule(plyCoordsX, plyCoordsY, plyCoordsZ, plyOffsetX, plyOffsetY, plyOffsetZ, 0.3, flags, PlayerPedId(), 7);
        let [_1, _2, _3, _4, entity] = GetShapeTestResult(rayHandle);

        return entity;
    },

    /**    
     * getVehicleInFront - description    
     *      
     * @memberof MRP_CLIENT
     * @return {type}  description     
     */
    getVehicleInFront: function() {
        return MRP_CLIENT.getEntityInFront(10);
    },

    /**    
     * getPedInFront - description    
     *      
     * @memberof MRP_CLIENT
     * @return {type}  description     
     */
    getPedInFront: function() {
        return MRP_CLIENT.getEntityInFront(12);
    },

    /**
     * getObjectInFront - description    
     *      
     * @memberof MRP_CLIENT
     * @return {type}  description     
     */
    getObjectInFront: function() {
        return MRP_CLIENT.getEntityInFront(16);
    },

    /**    
     * addBlips - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} blips description     
     * @return {type}       description     
     */
    addBlips: function(blips) {
        for (let v of blips) {
            let blip = AddBlipForCoord(v.x, v.y, v.z);
            SetBlipSprite(blip, v.blip);
            SetBlipScale(blip, 0.8);
            SetBlipAsShortRange(blip, true);
            SetBlipColour(blip, v.blipColor);

            BeginTextCommandSetBlipName("STRING");
            AddTextComponentString(v.blipName);
            EndTextCommandSetBlipName(blip);
        }
    },

    /**    
     * isPedNearCoords - description    
     *      
     * @memberof MRP_CLIENT
     * @param  {type} x     description     
     * @param  {type} y     description     
     * @param  {type} z     description     
     * @param  {type} area  description     
     * @param  {type} model description     
     * @return {type}       description     
     */
    isPedNearCoords: function(x, y, z, area, model) {
        if (!area)
            area = config.defaultIsPedNearArea;

        let peds = exports["mrp_core"].EnumeratePeds();
        let pedFound = false;
        for (let ped of peds) {
            let [entityX, entityY, entityZ] = GetEntityCoords(ped);
            let distance = Vdist(entityX, entityY, entityZ, x, y, z);
            if (model) {
                let entityModel = GetEntityModel(ped);
                if (entityModel != model)
                    continue;
            }

            if (distance < area) {
                pedFound = true;
                break;
            }

        }

        return pedFound;
    },

    /**    
     * spawnSharedNPC - {
     *     model: "a_f_m_ktown_02",
     *     x: 0,
     *     y: 0,
     *     z: 0,
     *     heading: 0
     * }
     * 
     * @memberof MRP_CLIENT     
     * @param  {type} opt options as described above
     * @param  {function} cb callback after done
     * @return {type}     PED     
     */
    spawnSharedNPC: function(opt, cb) {
        let exec = async () => {
            if (!NetworkIsHost()) {
                return;
            }

            let modelHash = opt.model;
            if (typeof opt.model === 'string' || opt.model instanceof String)
                modelHash = GetHashKey(opt.model);
            RequestModel(modelHash);
            while (!HasModelLoaded(modelHash)) {
                await MRP_CLIENT.sleep(100);
            }

            if (!MRP_CLIENT.isPedNearCoords(opt.x, opt.y, opt.z, null, modelHash)) {
                console.log(`adding NPC debug [${opt.model}] [${opt.x}] [${opt.y}] [${opt.z}] [${opt.heading}]`);

                let ped = CreatePed(0, modelHash, opt.x, opt.y, opt.z, opt.heading, true, true);
                SetEntityAsMissionEntity(ped, true, true);
                SetBlockingOfNonTemporaryEvents(ped, true);
                SetPedKeepTask(ped, true);
                SetPedDropsWeaponsWhenDead(ped, false);
                SetPedFleeAttributes(ped, 0, 0);
                SetPedCombatAttributes(ped, 17, 1);
                SetPedSeeingRange(ped, 0.0);
                SetPedHearingRange(ped, 0.0);
                SetPedAlertness(ped, 0.0);
                SetEntityInvincible(ped, true);

                await MRP_CLIENT.sleep(1000);

                let netId = 0;
                if (!NetworkGetEntityIsNetworked(ped)) {
                    console.log(`No network ID for entity trying to assign one`);
                    NetworkRegisterEntityAsNetworked(ped);
                }
                netId = PedToNet(ped);
                SetNetworkIdCanMigrate(netId, false);
                NetworkUseHighPrecisionBlending(netId, false);
                console.log(`Network ID [${netId}]`);
                SetNetworkIdExistsOnAllMachines(netId, true);

                /*await MRP_CLIENT.sleep(1000);

                FreezeEntityPosition(ped, true);*/

                if (cb)
                    cb(ped);
            }
        };
        exec();
    },

    /**
     * createProp - description    
     *      
     * @param  {string} prop       model hash
     * @param  {int} propBone      bone ID
     * @param  {object} propPlacement {
     *     xPos: 0.025,
     *     yPos: 0.08,
     *     zPos: 0.255,
     *     xRot: -145.0,
     *     yRot: 290.0,
     *     zRot: 0.0
     * }
     * @return {int}               prop ID
     */
    createProp: function(prop, propBone, propPlacement) {
        let ped = PlayerPedId();
        let [coordsX, coordsY, coordsZ] = GetEntityCoords(ped);
        let object = CreateObject(GetHashKey(prop),
            coordsX + 0.0,
            coordsY + 0.0,
            coordsZ + 0.2,
            true, true, true);

        AttachEntityToEntity(object, ped, GetPedBoneIndex(ped, propBone), propPlacement.xPos, propPlacement.yPos, propPlacement.zPos, propPlacement.xRot, propPlacement.yRot, propPlacement.zRot, true, true, false, true, 1, true);

        return object;
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