if (config.world.persistCharacters) {
    MRP_CLIENT.CreateThread(() => {
        let cycle = async function() {
            let lastEntityHealth = 0;
            let lastCharacter = null;

            while (true) {
                await MRP_CLIENT.sleep(0);

                let playerPed = PlayerPedId();

                let currentHealth = GetEntityHealth(playerPed);
                let character = MRP_CLIENT.GetPlayerData();
                if (!character) {
                    await MRP_CLIENT.sleep(500);
                    continue;
                }

                if (lastEntityHealth != currentHealth) {
                    if (character.sex == "MALE") {
                        //because reasons :D
                        character.stats.health = currentHealth - 100;
                    } else {
                        character.stats.health = currentHealth;
                    }
                    lastEntityHealth = currentHealth;
                    emitNet('mrp:updateCharacter', character);
                    emit('mrp:updateCharacter', character);
                } else {
                    if (lastCharacter == null)
                        lastCharacter = character;

                    let lastCharString = JSON.stringify(lastCharacter);
                    let curCharString = JSON.stringify(character);
                    if (lastCharString != curCharString) {
                        //something changed send update
                        emitNet('mrp:updateCharacter', character);
                        emit('mrp:updateCharacter', character);
                    }

                    lastCharacter = character;
                }

                await MRP_CLIENT.sleep(500);
            }
        };

        cycle();
    });
}