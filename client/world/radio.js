if (!config.world.vehicleRadioEnabled) {
    MRP_CLIENT.CreateThread(() => {
        let cycle = async function() {
            while (true) {
                await MRP_CLIENT.sleep(1000);

                let playerPed = PlayerPedId();
                if (IsPedInAnyVehicle(playerPed)) {
                    SetUserRadioControlEnabled(false);
                    if (GetPlayerRadioStationName())
                        SetVehRadioStation(GetVehiclePedIsIn(playerPed), "OFF");
                }
            }
        };

        cycle();
    });
}