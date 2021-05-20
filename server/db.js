const config = require('../config/default.json');

const MongoClient = require('mongodb').MongoClient;
const Timestamp = require('mongodb').Timestamp;
const ObjectID = require('mongodb').ObjectID;
const logger = require('../shared/debug.js');
const BSON = require('bson');
const bson = new BSON();

// Connection URL
const url = config.DB.url;

// Database Name
const dbName = config.DB.name;
const client = new MongoClient(url, {
    useUnifiedTopology: true
});

//new default character starts
const DEFAULT_HEALTH = config.newCharacter.health;
const DEFAULT_ARMOR = config.newCharacter.armor;
const DEFAULT_HUNGER = config.newCharacter.hunger;
const DEFAULT_THIRST = config.newCharacter.thirst;
const DEFAULT_CASH = config.newCharacter.cash;
const DEFAULT_BANK = config.newCharacter.bank;
const DEFAULT_STRESS = config.newCharacter.stress;

let db;

MRP.getPlayer = async function(source) {
    if (!db)
        return null;

    const collection = db.collection('user');

    let id = MRP.getFivemId(source);
    let storedUser = await collection.findOne({
        _id: id
    });
    return storedUser;
};

MRP.setLastUsedCharacter = async function(source, char) {
    if (!db)
        return null;

    let player = await MRP.getPlayer(source);
    player.lastCharacter = char._id;

    const collection = db.collection('user');

    let query = {
        _id: player._id
    };
    let options = {
        upsert: true
    };
    const result = await collection.updateOne(query, {
        $set: player
    }, options);

    logger.log(`Last character used operation count ${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`);

    return player;
}

MRP.getCharacters = async function(source) {
    if (!db)
        return null;

    const collection = db.collection('character');

    let id = MRP.getFivemId(source);
    let cursor = await collection.find({
        owner: id
    }, {
        sort: {
            surname: 1
        }
    });

    let chars = [];
    if ((await cursor.count()) === 0) {
        logger.log('No characters found!');
    } else {
        chars = cursor.toArray();
    }

    return chars;
};

MRP.toObjectId = function(obj) {
    let arrayBuffer = [];
    for (let i in obj) {
        arrayBuffer.push(obj[i]);
    }

    let buf = Buffer.from(arrayBuffer);

    let objId = new ObjectID(buf);

    return objId;
};

MRP.toMongoTimestamp = function(obj) {
    return Timestamp.fromBits(obj.low_, obj.high_);
}

MRP.deleteCharacter = async function(id) {
    const collection = db.collection('character');

    let objId = id;
    if (id.id)
        objId = MRP.toObjectId(id.id);

    const result = await collection.deleteOne({
        _id: objId
    });

    logger.log(`Deleted character count ${result.modifiedCount}`);
}

MRP.createCharacter = function(player, inputChar, cb) {
    const collection = db.collection('character');

    const create = async function() {
        let birthDate = inputChar.birthday ? new Date(inputChar.birthday).getTime() : Date.now();
        const result = await collection.insertOne({
            name: inputChar.name,
            surname: inputChar.surname,
            stats: {
                health: DEFAULT_HEALTH,
                armor: DEFAULT_ARMOR,
                hunger: DEFAULT_HUNGER,
                thirst: DEFAULT_THIRST,
                stress: DEFAULT_STRESS,
                cash: DEFAULT_CASH,
                bank: DEFAULT_BANK
            },
            job: {
                name: "unemployed"
            },
            sex: inputChar.sex || "MALE",
            birthday: Timestamp.fromNumber(birthDate),
            model: (inputChar.sex == "FEMALE") ? "mp_f_freemode_01" : "mp_m_freemode_01",
            owner: player._id
        }, cb);

        logger.log(`mrp:createCharacter [${inputChar.name} ${inputChar.surname}] created`);
    }

    create();
}

// Use connect method to connect to the server
client.connect(function(err) {
    if (err)
        logger.log(err);
    else
        logger.log('Connected successfully to server');

    db = client.db(dbName);
});

// shutdown
on('onResourceStop', (resource) => {
    if (resource == GetCurrentResourceName()) {
        logger.log('Closing DB connection');
        client.close();
    }
});

on('mrp:userLogin', (playerName, source, fivemID) => {
    logger.log(`mrp:userLogin -> ${playerName}, ${source}, ${fivemID}`);
    if (!db)
        return;

    const collection = db.collection('user');

    const create = async function() {
        //insert or update
        let query = {
            _id: fivemID
        };
        let user = {
            _id: fivemID,
            name: playerName,
            lastLoginTimestamp: Timestamp.fromNumber(Date.now())
        };
        let options = {
            upsert: true
        };
        const result = await collection.updateOne(query, {
            $set: user
        }, options);

        logger.log(`mrp:userLogin ${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`);

        let storedUser = await collection.findOne({
            _id: fivemID
        });
        emit('mrp:userJoined', storedUser);
    };

    create();
});

onNet('mrp:createCharacter', (source, inputChar) => {
    let execute = async () => {
        let player = await MRP.getPlayer(source);
        MRP.createCharacter(player, inputChar, (err, response) => {
            if (err) {
                logger.log('Error occurred while inserting');
            } else {
                logger.log('inserted record' + JSON.stringify(response.ops[0]));
                emitNet('mrp:createdCharacter', source, response.ops[0]);
            }
        });
    };
    execute();
});

/*on('mrp:createCharacter', (player, inputChar) => {
    MRP.createCharacter(player, inputChar);
});*/

onNet('mrp:updateCharacter', (character) => {
    if (!character || !character._id)
        return;

    delete character.entityID;

    //convert mangled ObjectId    
    let objId = MRP.toObjectId(character._id.id);
    character._id = objId;

    //convert timestamp
    character.birthday = MRP.toMongoTimestamp(character.birthday);

    const collection = db.collection('character');

    const update = async function() {
        let query = {
            _id: objId
        };
        let options = {
            upsert: true
        };
        let result;
        try {
            result = await collection.updateOne(query, {
                $set: character
            }, options);
        } catch (err) {
            logger.log(`ERROR: ${err}`); // TypeError: failed to fetch
        }

        logger.log(`mrp:updateCharacter ${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`);
        if (result.modifiedCount > 0)
            logger.log(`mrp:updateCharacter [${character.name} ${character.surname}] updated`);
    }

    update();
});


onNet('mrp:deleteCharacter', (source, charId) => {
    //TODO
    if (!charId)
        return;

    MRP.deleteCharacter(charId);
});

module.exports = {

};