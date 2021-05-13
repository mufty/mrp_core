if(config.world.vehicleOnlyRadar) {
    MRP_CLIENT.CreateThread(()=>{
        let cycle = async function(){
            while(true){
                await MRP_CLIENT.sleep(500);

                let playerPed = PlayerPedId();
				let radarEnabled = IsRadarEnabled();
				
				if(!IsPedInAnyVehicle(playerPed) && radarEnabled){
					DisplayRadar(false)
				} else if(IsPedInAnyVehicle(playerPed) && !radarEnabled) {
					DisplayRadar(true)
				}
		
				await MRP_CLIENT.sleep(500);
            }
        };

        cycle();
    });
}
