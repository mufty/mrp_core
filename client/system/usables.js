const TYPE_EFFECT = "effect";
const TYPE_ANIM = "anim";
const TYPE_STATS = "stats";
const DEFAULT_SPRINT_MULTIPLIER = 1;
const DEFAULT_MOVE_RATE = 1;

let sprintMultiplier = 1;
let moveRate = 1;

function playEffect(fx, duration, loop) {
    AnimpostfxPlay(fx, duration, loop);
    //stop effect after duration it should end if it's not looping on it's own but it doesn't sometimes
    setTimeout(() => {
        AnimpostfxStop(fx);
    }, duration);
}

//main interval for stats and things
setInterval(() => {
    let player = PlayerId();

    if (player && player > 0) {
        SetRunSprintMultiplierForPlayer(player, sprintMultiplier);
        SetPedMoveRateOverride(player, moveRate);
    }
}, 0);

onNet('mrp:client:useables:use', (usable) => {
    if (!usable || !usable.useable || !usable.onUse) {
        console.log(`Tried using something that isn't usable`);
        return;
    }

    let onUse = usable.onUse;
    let startTS = Date.now();
    for (let use of onUse) {
        switch (use.type) {
            case TYPE_EFFECT:
                if (use.delay) {
                    let ts = Date.now();
                    //add time spend processing to delay
                    let timeToAdd = ts - startTS;
                    setTimeout(() => {
                        playEffect(use.effect, use.duration, use.loop);
                    }, use.delay + timeToAdd);
                } else {
                    playEffect(use.effect, use.duration, use.loop);
                }
                break;
            case TYPE_ANIM:
                if (use.delay) {
                    let ts = Date.now();
                    //add time spend processing to delay
                    let timeToAdd = ts - startTS;
                    setTimeout(() => {
                        emit('mrp:lua:taskPlayAnim', PlayerPedId(),
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
                    }, use.delay + timeToAdd);
                } else {
                    emit('mrp:lua:taskPlayAnim', PlayerPedId(),
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
                }
                break;
            case TYPE_STATS:
                if (use.name == 'speed') {
                    sprintMultiplier = use.multiplier;
                    moveRate = use.rate;
                    if (use.duration) {
                        setTimeout(() => {
                            //reset speed after duration
                            sprintMultiplier = DEFAULT_SPRINT_MULTIPLIER;
                            moveRate = DEFAULT_MOVE_RATE;
                        }, use.duration);
                    }
                }
                break;
            default:
                break;
        }
    }
});