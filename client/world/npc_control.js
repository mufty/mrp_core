MRP_CLIENT.CreateThread(()=>{
    let cycle = async function(){
        while(true){
            await MRP_CLIENT.sleep(0);

            SetVehicleDensityMultiplierThisFrame(config.world.npc.vehicleDensity);
            SetPedDensityMultiplierThisFrame(config.world.npc.pedDensity);
            SetRandomVehicleDensityMultiplierThisFrame(config.world.npc.randomVehicleDensity);
            SetParkedVehicleDensityMultiplierThisFrame(config.world.npc.parkedVehicleDensity);
            SetScenarioPedDensityMultiplierThisFrame(config.world.npc.scenarioPedDensity[0], config.world.npc.scenarioPedDensity[1]);
            SetGarbageTrucks(config.world.npc.garbageTrucks);
            SetRandomBoats(config.world.npc.randomBoats);
            SetCreateRandomCops(config.world.npc.randomCops);
            SetCreateRandomCopsNotOnScenarios(config.world.npc.randomCopsNoScenarios);
            SetCreateRandomCopsOnScenarios(config.world.npc.randomCopsScenarios);

            let playerPed = PlayerPedId();
            if(!config.world.npc.copsEnabled) {
                let [x,y,z] = GetEntityCoords(playerPed);
                ClearAreaOfCops(x, y, z, 400.0);
            }

            if(!config.world.npc.wantedLevelEnabled && GetPlayerWantedLevel(playerPed) != 0) {
                SetPlayerWantedLevel(playerPed, 0, false)
                SetPlayerWantedLevelNow(playerPed, false)
            }
        }
    }
    cycle();
});
