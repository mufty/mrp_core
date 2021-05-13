if(config.world.persistCharacters) {
    MRP_CLIENT.CreateThread(()=>{
        let cycle = async function(){
            let lastEntityHealth = 0;

            while(true){
                await MRP_CLIENT.sleep(0);

                let playerPed = PlayerPedId();

                let currentHealth = GetEntityHealth(playerPed);
                if(lastEntityHealth != currentHealth) {
                    let character = MRP_CLIENT.GetPlayerData();
                    if(!character) {
                        await MRP_CLIENT.sleep(500);
                        continue;
                    }

                    if(character.sex == "MALE") {
                        //because reasons :D
                        character.stats.health = currentHealth - 100;
                    } else {
                        character.stats.health = currentHealth;
                    }
                    lastEntityHealth = currentHealth;
                    emitNet('mrp:updateCharacter', character);
                }

                await MRP_CLIENT.sleep(500);
            }
        };

        cycle();
    });
}
