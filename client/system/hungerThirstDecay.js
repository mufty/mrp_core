//TODO maybe move this logic to server

const HUNGER_REDUCTION = 1;
const THIRST_REDUCTION = 1;

if (config.world.hungerDecay || config.world.thirstDecay) {
    MRP_CLIENT.CreateThread(() => {
        let hungerDecay = async function() {
            let lastHunger = null;
            while (true) {
                await MRP_CLIENT.sleep(0);

                let character = MRP_CLIENT.GetPlayerData();
                if (!character) {
                    await MRP_CLIENT.sleep(config.world.hungerDecayTimer);
                    continue;
                }

                character.stats.hunger = character.stats.hunger - HUNGER_REDUCTION;
                if (character.stats.hunger < 0)
                    character.stats.hunger = 0;

                if (config.world.hungerToHealth && character.stats.hunger == 0) {
                    emit('mrp:addHealth', config.world.hungerToHealthDecay);
                }

                /*if (character.stats.hunger != lastHunger) {
                    emitNet('mrp:updateCharacter', character);
                    emit('mrp:updateCharacter', character);
                }*/

                lastHunger = character.stats.hunger;

                await MRP_CLIENT.sleep(config.world.hungerDecayTimer);
            }
        }

        if (config.world.hungerDecay)
            hungerDecay();

        let thirstDecay = async function() {
            let lastThirst = null;
            while (true) {
                await MRP_CLIENT.sleep(0);

                let character = MRP_CLIENT.GetPlayerData();
                if (!character) {
                    await MRP_CLIENT.sleep(config.world.thirstDecayTimer);
                    continue;
                }

                character.stats.thirst = character.stats.thirst - THIRST_REDUCTION;
                if (character.stats.thirst < 0)
                    character.stats.thirst = 0;

                /*if (character.stats.thirst != lastThirst) {
                    emitNet('mrp:updateCharacter', character);
                    emit('mrp:updateCharacter', character);
                }*/

                lastThirst = character.stats.thirst;

                await MRP_CLIENT.sleep(config.world.thirstDecayTimer);
            }
        }
        if (config.world.thirstDecay)
            thirstDecay();
    });
}