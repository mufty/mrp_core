if (config.world.persistCharacters) {
    MRP_CLIENT.CreateThread(() => {
        let cycle = async function() {
            let lastEntityHealth = 0;
            let lastCharacter = {};

            while (true) {
                await MRP_CLIENT.sleep(0);

                let playerPed = PlayerPedId();

                let character = MRP_CLIENT.GetPlayerData();
                if (!character) {
                    await MRP_CLIENT.sleep(250);
                    continue;
                }

                let currentHealth = GetEntityHealth(playerPed);
                let currentArmor = GetPedArmour(playerPed);

                character.stats.armor = currentArmor;

                if (lastEntityHealth != currentHealth) {
                    if (character.sex == "MALE") {
                        //because reasons :D
                        character.stats.health = currentHealth - 100;
                    } else {
                        character.stats.health = currentHealth;
                    }
                    lastEntityHealth = currentHealth;
                }

                let lastCharString = JSON.stringify(lastCharacter);
                let curCharString = JSON.stringify(character);
                if (lastCharString != curCharString) {
                    //something changed send update
                    emitNet('mrp:updateCharacter', character);
                    emit('mrp:updateCharacter', character);
                }

                //make a copy to not reference the same object
                lastCharacter = JSON.parse(curCharString);

                await MRP_CLIENT.sleep(250);
            }
        };

        cycle();
    });
}