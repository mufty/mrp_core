// Default key is E INPUT_PICKUP to change check https://docs.fivem.net/docs/game-references/controls/ and change in config file

MRP_CLIENT.CreateThread(()=>{
    let cycle = async function(){
        while(true){
            await MRP_CLIENT.sleep(0);
            let ped = PlayerPedId();
            if(IsPedSprinting(ped) && !IsPedInAnyVehicle(ped) && IsControlJustReleased(0, config.controls.tackle)) { //move key to config
                let [x, y, z] = GetEntityForwardVector(ped);
                let forwardVector = {x, y, z};
                let tackled = {};

                SetPedToRagdollWithFall(
            		ped,
            		config.tackle.time,
            		1500,
            		0,
            		forwardVector.x,
            		forwardVector.y,
            		forwardVector.z,
            		1.0,
            		0.0,
            		0.0,
            		0.0,
            		0.0,
            		0.0,
            		0.0
	           );

               while(IsPedRagdoll(ped)){
                   await MRP_CLIENT.sleep(0);
                   let touchedPlayers = getTouchedPlayers();
                   for(let value of touchedPlayers){
                       if(!tackled[value]) {
                           tackled[value] = true;
                           let wholeName = MRP_CLIENT.GetPlayerData().name + " " + MRP_CLIENT.GetPlayerData().surname;
                           emitNet('mrp:server:tacklePlayer', GetPlayerServerId(value), forwardVector, wholeName);
                       }
                   }
               }
            }
        }
    }
    cycle();
});

onNet('mrp:client:tacklePlayer', (tackled, forvardVector, tackler) => {
    SetPedToRagdollWithFall(
        PlayerPedId(),
        config.tackle.tackledTime,
        3000,
        0,
        forwardVector.x,
        forwardVector.y,
        forwardVector.z,
        10.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0
   );
});

function getPlayers(){
    let players = [];

    //TODO not sure if I like this GetPlayers is available on server in LUA might just call that
    for(let i = 0; i < 255; i++) {
        if(NetworkIsPlayerActive(i)) {
            players.push(i);
        }
   }

   return players;
}

function getTouchedPlayers(){
    let touchedPlayers = [];
    for(let value of getPlayers()){
        if(IsEntityTouchingEntity(PlayerPedId(), GetPlayerPed(value))){
            touchedPlayers.push(value);
        }
    }
    return touchedPlayers;
}
