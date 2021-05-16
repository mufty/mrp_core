let cfg = config.world.stress;
if (cfg.blurEnabled) {
    MRP_CLIENT.CreateThread(() => {
        let cycle = async function() {
            while (true) {
                let char = MRP_CLIENT.GetPlayerData();

                if (!char) {
                    await MRP_CLIENT.sleep(250);
                    continue;
                }

                let breakpoint = null;

                for (let b of cfg.breakpoints) {
                    if (char.stats.stress <= b.max && char.stats.stress > b.min)
                        breakpoint = b;
                }

                if (breakpoint != null) {
                    TriggerScreenblurFadeIn(breakpoint.fadeIn);
                    setTimeout(() => {
                        TriggerScreenblurFadeOut(breakpoint.fadeOut);
                    }, breakpoint.fadeStay);

                    await MRP_CLIENT.sleep(breakpoint.fadeTimeout);
                } else {
                    await MRP_CLIENT.sleep(250);
                }
            }
        }
        cycle();

        //TODO shooting adds stress/gun in hand adds stress?
    });
}