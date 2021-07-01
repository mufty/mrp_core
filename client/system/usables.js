const TYPE_EFFECT = "effect";
const TYPE_ANIM = "anim";
const TYPE_STATS = "stats";
const TYPE_EVENT = "event";
const DEFAULT_SPRINT_MULTIPLIER = 1;
const DEFAULT_MOVE_RATE = 1;

let sprintMultiplier = 1;
let moveRate = 1;

function playEffect(fx, duration, loop, resolve) {
    AnimpostfxPlay(fx, duration, loop);
    //stop effect after duration it should end if it's not looping on it's own but it doesn't sometimes
    setTimeout(() => {
        AnimpostfxStop(fx);
        resolve(true);
    }, duration);
}

function playAnim(use, resolve) {
    let ped = PlayerPedId();
    let prop;
    if (use.attachment) {
        let att = use.attachment;
        let [coordsX, coordsY, coordsZ] = GetEntityCoords(ped);
        prop = CreateObject(GetHashKey(att.prop),
            coordsX + 0.0,
            coordsY + 0.0,
            coordsZ + 0.2,
            true, true, true);

        AttachEntityToEntity(prop, ped, GetPedBoneIndex(ped, att.boneId), att.xPos, att.yPos, att.zPos, att.xRot, att.yRot, att.zRot, true, true, false, true, 1, true);
    }

    emit('mrp:lua:taskPlayAnim', ped,
        use.dict,
        use.anim,
        use.blendInSpeed,
        use.blendOutSpeed,
        use.duration,
        use.flag,
        use.playbackRate,
        use.lockX,
        use.lockY,
        use.lockZ);

    if (prop && use.duration > 0) {
        setTimeout(() => {
            ClearPedSecondaryTask(ped);
            DeleteObject(prop);
            resolve(true);
        }, use.duration);
    } else {
        if (use.duration > 0)
            setTimeout(() => resolve(true), use.duration);
        else
            resolve(true);
    }
}

//main interval for stats and things
setInterval(() => {
    let player = PlayerId();

    if (player && player > 0) {
        SetRunSprintMultiplierForPlayer(player, sprintMultiplier);
        SetPedMoveRateOverride(player, moveRate);
    }
}, 0);

onNet('mrp:client:useables:use', (useable, callbackEvent) => {
    if (!useable || !useable.useable || !useable.onUse) {
        console.log(`Tried using something that isn't useable`);
        return;
    }

    let onUse = useable.onUse;
    let startTS = Date.now();
    let promises = [];
    for (let use of onUse) {
        promises.push(new Promise((resolve, reject) => {
            switch (use.type) {
                case TYPE_EFFECT:
                    if (use.delay) {
                        let ts = Date.now();
                        //add time spend processing to delay
                        let timeToAdd = ts - startTS;
                        setTimeout(() => {
                            playEffect(use.effect, use.duration, use.loop, resolve);
                        }, use.delay + timeToAdd);
                    } else {
                        playEffect(use.effect, use.duration, use.loop, resolve);
                    }
                    break;
                case TYPE_ANIM:
                    if (use.delay) {
                        let ts = Date.now();
                        //add time spend processing to delay
                        let timeToAdd = ts - startTS;
                        setTimeout(() => {
                            playAnim(use, resolve);
                        }, use.delay + timeToAdd);
                    } else {
                        playAnim(use, resolve);
                    }
                    break;
                case TYPE_STATS:
                    if (use.name == 'speed') {
                        sprintMultiplier = use.multiplier;
                        moveRate = use.rate;
                        if (use.duration > 0) {
                            setTimeout(() => {
                                //reset speed after duration
                                sprintMultiplier = DEFAULT_SPRINT_MULTIPLIER;
                                moveRate = DEFAULT_MOVE_RATE;
                                resolve(true);
                            }, use.duration);
                        }
                    } else if (use.name == 'hunger' || use.name == 'thirst' || use.name == 'stress' || use.name == 'armor' || use.name == 'health') {
                        let tick = use.tick;
                        if (tick) {
                            let count = 0;
                            let interval = setInterval(() => {
                                addStat(use.name, tick.factor);
                                count++;
                                if (count >= tick.count) {
                                    clearInterval(interval);
                                    resolve(true);
                                }
                            }, tick.tickCadence);
                        }
                    }
                    break;
                case TYPE_EVENT:
                    if (use.client) {
                        console.log(`Sending client event [${use.client}]`);
                        emit(use.client, useable);
                    }
                    if (use.server) {
                        console.log(`Sending server event [${use.server}]`);
                        emitNet(use.server, GetPlayerServerId(PlayerId()), useable);
                    }
                    resolve(true);
                    break;
                default:
                    break;
            }
        }));
    }

    Promise.all(promises).then((values) => {
        //everything done
        if (callbackEvent) {
            emitNet(callbackEvent, GetPlayerServerId(PlayerId()), useable);
        }
    });
});