const config = require('../config/default.json');

const db = require('./db.js');
const logger = require('../shared/debug.js');

const rawConsoleColor = config.console.system.color;
print(rawConsoleColor);
let RGB_ARRAY = rawConsoleColor.split(',');
//convert to numbers
for(let i in RGB_ARRAY) {
    RGB_ARRAY[i] = parseInt(RGB_ARRAY[i]);
}

RegisterCommand('users', (source, args, rawCommand) => {
    let users = MRP.getConnectedUsers();

    let playerName = GetPlayerName(source);

    let msg = "";

    for(let id in users) {
        msg += users[id].name + ", ";
    }

    msg = msg.slice(0, -2);

    emitNet('chat:addMessage', source, {
        color: RGB_ARRAY,
        multiline: true,
        args: ['Connected users', msg]
    });
}, false);

RegisterCommand('createCharacter', (source, args, cmd) => {
    let execute = async function(){
        let player = await MRP.getPlayer(source);

        if(player){
            // args = name surname;
            let name = args[0];
            let surname = args[1];

            emit('mrp:createCharacter', player, {name, surname});
        } else {
            logger.log(`Player doesn't exist in database!`);
        }
    };

    execute();
});

RegisterCommand('listCharacters', (source, args, cmd) => {
    let execute = async function(){
        let characters = await MRP.getCharacters(source);

        if(characters && characters.length > 0){
            let chatList = "";
            for(let char of characters){
                chatList += `[${char._id} - ${char.name} ${char.surname}] `;
            }

            emitNet('chat:addMessage', source, {
                color: RGB_ARRAY,
                multiline: true,
                args: ['Characters', chatList]
            });
        } else {
            emitNet('chat:addMessage', source, {
                color: RGB_ARRAY,
                multiline: true,
                args: ['Characters', "no characters"]
            });
        }
    };

    execute();
});

RegisterCommand('useCharacter', (source, args, cmd) => {
    let execute = async function(){
        let characters = await MRP.getCharacters(source);

        // args = name surname;
        let name = args[0];
        let surname = args[1];

        if(!name || !surname){
            emitNet('chat:addMessage', source, {
                color: RGB_ARRAY,
                multiline: true,
                args: ['Use charcater', "Missing parameter requires Name Surname"]
            });
            return;
        }

        if(characters && characters.length > 0){
            let characterToUse = null;
            for(let char of characters){
                if(char.name == name && char.surname == surname)
                    characterToUse = char;
            }

            characterToUse.entityID = ENTITIES++;
            if(characterToUse == null) {
                emitNet('chat:addMessage', source, {
                    color: RGB_ARRAY,
                    multiline: true,
                    args: ['Use charcater', "Didn't find the specified character by name and surname"]
                });
            } else {
                let update = async function(){
                    let updatedUser = await MRP.setLastUsedCharacter(source, characterToUse);
                    let users = MRP.getConnectedUsers();
                    users[updatedUser._id] = updatedUser;
                };
                update();
                let spawnPoint = {};
                Object.assign(spawnPoint, config.spawnPoints[0]);
                spawnPoint.model = characterToUse.model;
                emitNet('mrp:spawn', source, characterToUse, spawnPoint);
            }
        } else {
            emitNet('chat:addMessage', source, {
                color: RGB_ARRAY,
                multiline: true,
                args: ['Use charcater', "no characters"]
            });
        }
    };

    execute();
});

RegisterCommand('pos', (source, args, cmd) => {
    let pos = MRP.getEntityPosition(source);
    if(pos && pos.length > 4) {
        let [posX, posY, posZ, posHeading] = pos;
        let msg = `Heading: ${posHeading} | x: ${posX} | y: ${posY} | z: ${posZ}`;

        emitNet('chat:addMessage', source, {
            color: RGB_ARRAY,
            multiline: true,
            args: ['[Obtain Position]', msg]
        });
    }
});

RegisterCommand('respawn', (source) => {
    emitNet('mrp:spawn', source);
});

RegisterCommand('revive', (source) => {
    emitNet('mrp:revive', source);
});
