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
    /*
    {
      x: 686.245,
      y: 577.950,
      z: 130.461,
      model: 'a_m_m_skater_01'
    }*/
    exports.spawnmanager.spawnPlayer(spawnIdx, () => {
      emit('chat:addMessage', {
        args: [
          'Hi, there!'
        ]
      })
    });
});
