if (config.world.hideHudComps && config.world.hideHudComps.length > 0) {
    MRP_CLIENT.CreateThread(() => {
        while (true) {
            for (let hudId of config.world.hideHudComps) {
                /*
                1 : WANTED_STARS
                2 : WEAPON_ICON
                3 : CASH
                4 : MP_CASH
                5 : MP_MESSAGE
                6 : VEHICLE_NAME
                7 : AREA_NAME
                8 : VEHICLE_CLASS
                9 : STREET_NAME
                10 : HELP_TEXT
                11 : FLOATING_HELP_TEXT_1
                12 : FLOATING_HELP_TEXT_2
                13 : CASH_CHANGE
                14 : RETICLE
                15 : SUBTITLE_TEXT
                16 : RADIO_STATIONS
                17 : SAVING_GAME
                18 : GAME_STREAM
                19 : WEAPON_WHEEL
                20 : WEAPON_WHEEL_STATS
                21 : HUD_COMPONENTS
                22 : HUD_WEAPONS
                */
                HideHudComponentThisFrame(hudId)
            }
        }
    });
}