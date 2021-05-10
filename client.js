//load config
let configFile = LoadResourceFile(GetCurrentResourceName(), 'config/client.json');

let config = JSON.parse(configFile);

const spawnPoints = config.spawnPoints;

//load spawnpoints
for(let sp of spawnPoints){
    exports.spawnmanager.addSpawnPoint(sp);
}

let currentCharacter = null;

onNet('mrp:spawn', (char, spawnIdx) => {
    currentCharacter = char;
    
    exports.spawnmanager.spawnPlayer(spawnIdx, () => {
      emit('chat:addMessage', {
        args: [
          'Hi, there!'
        ]
      })
    });
});
