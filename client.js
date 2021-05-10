//load config
let configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

let config = JSON.parse(configFile);

const spawnPoints = config.spawnPoints;

//load spawnpoints
for(let sp of spawnPoints){
    exports.spawnmanager.addSpawnPoint(sp);
}

let currentCharacter = null;
let currentSpawnId = null;

onNet('mrp:spawn', (char, spawnIdx) => {
    if(!char && currentCharacter) {
        currentCharacter = currentCharacter;
        currentSpawnId = spawnIdx;
    } else if (char) {
        currentCharacter = char;
    } else {
        return;
    }

    exports.spawnmanager.spawnPlayer(currentSpawnId, () => {
        emit('chat:addMessage', {
            args: [
              'Hi, there!'
            ]
        });

        let health = currentCharacter.stats.health;
        if(currentCharacter.gender == "MALE") {
            //because reasons :D
            health += 100;
        }

        let ped = PlayerPedId();
        SetEntityHealth(ped, health);
        SetPedArmour(ped, currentCharacter.stats.armor);
    });
});

onNet('mrp:revive', () => {
    if(currentCharacter == null)
        return;

    let health = currentCharacter.stats.health;
    if(currentCharacter.gender == "MALE") {
        //because reasons :D
        health += 100;
    }

    let ped = PlayerPedId();
    SetPlayerInvincible(ped, false);
    SetEntityHealth(ped, health);
    SetPedArmour(ped, currentCharacter.stats.armor);
});
