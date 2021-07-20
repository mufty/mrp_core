const config = require('../config/default.json');

const MongoClient = require('mongodb').MongoClient;
const Timestamp = require('mongodb').Timestamp;
const ObjectID = require('mongodb').ObjectID;
require('../shared/debug.js');
const logger = mrp_logger;
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

let exportObj = {
    test: "test"
};

let db;


/**
 * MRP - description
 * 
 * @memberof MRP_SERVER
 * @param  {type} source description 
 * @return {type}        description 
 */
MRP.getPlayer = async function(source) {
    if (!db)
        return null;

    const collection = db.collection('user');

    let id = MRP.getUserId(source);
    let storedUser = await collection.findOne({
        _id: id
    });
    return storedUser;
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} source description 
 * @param  {type} char   description 
 * @return {type}        description 
 */
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


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} source description 
 * @return {type}        description 
 */
MRP.getCharacters = async function(source) {
    if (!db)
        return null;

    const collection = db.collection('character');

    let id = MRP.getUserId(source);
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


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} obj description 
 * @return {type}     description 
 */
MRP.toObjectId = function(obj) {
    let arrayBuffer = [];
    for (let i in obj) {
        arrayBuffer.push(obj[i]);
    }

    let buf = Buffer.from(arrayBuffer);

    let objId = new ObjectID(buf);

    return objId;
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} obj description 
 * @return {type}     description 
 */
MRP.toMongoTimestamp = function(obj) {
    return Timestamp.fromBits(obj.low_, obj.high_);
}


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} id description 
 * @return {type}    description 
 */
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


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} player    description 
 * @param  {type} inputChar description 
 * @param  {type} cb        description 
 * @return {type}           description 
 */
MRP.createCharacter = function(player, inputChar, cb) {
    if (!player || !inputChar)
        return;

    const collection = db.collection('character');

    const create = async function() {
        let birthDate = inputChar.birthday ? new Date(inputChar.birthday).getTime() : Date.now();

        const agg = [{
            '$group': {
                '_id': '$item',
                'maxStateId': {
                    '$max': '$stateId'
                }
            }
        }];
        //aggreage max state ids to generate a new one
        const cursor = await collection.aggregate(agg);
        let maxId = await cursor.toArray();
        let stateId = 1;
        if (maxId && maxId.length > 0 && maxId[0].maxStateId) {
            stateId += maxId[0].maxStateId;
        }
        const result = await collection.insertOne({
            name: inputChar.name,
            surname: inputChar.surname,
            stats: {
                health: DEFAULT_HEALTH,
                armor: DEFAULT_ARMOR,
                hunger: DEFAULT_HUNGER,
                thirst: DEFAULT_THIRST,
                stress: DEFAULT_STRESS,
                cash: DEFAULT_CASH
            },
            job: {
                name: "unemployed"
            },
            stateId: stateId,
            sex: inputChar.sex || "MALE",
            birthday: Timestamp.fromNumber(birthDate),
            model: (inputChar.sex == "FEMALE") ? "mp_f_freemode_01" : "mp_m_freemode_01",
            owner: player._id
        }, cb);

        logger.log(`mrp:createCharacter [${inputChar.name} ${inputChar.surname}] created`);
    }

    create();
}


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} id             description 
 * @return {type}                description 
 */
MRP.delete = async function(collectionName, id) {
    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "delete",
            args: arguments
        });
        return;
    }

    const collection = db.collection(collectionName);

    let objId = id;
    if (id.id)
        objId = MRP.toObjectId(id.id);

    const result = await collection.deleteOne({
        _id: objId
    });

    logger.log(`Deleted ${collectionName} count ${result.modifiedCount}`);
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} q              description 
 * @return {type}                description 
 */
MRP.deleteQuery = function(collectionName, q) {
    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "delete",
            args: arguments
        });
        return;
    }

    const collection = db.collection(collectionName);

    normalizeIDs(q)
    const result = collection.deleteOne(q);

    logger.log(`Deleted ${collectionName} count ${result.modifiedCount}`);
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} obj            description 
 * @param  {type} cb             description 
 * @return {type}                description 
 */
MRP.create = function(collectionName, obj, cb) {
    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "create",
            args: arguments
        });
        return;
    }

    const collection = db.collection(collectionName);

    normalizeIDs(obj);

    const create = async function() {
        const result = await collection.insertOne(obj);

        logger.log(`[${collectionName}] created`);

        if (result)
            cb(result);
    }

    create();
};

let stashedCalls = [];


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} obj            description 
 * @param  {type} q              description 
 * @param  {type} opt            description 
 * @param  {type} cb             description 
 * @return {type}                description 
 */
MRP.update = function(collectionName, obj, q, opt, cb) {
    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "update",
            args: arguments
        });
        return;
    }


    const collection = db.collection(collectionName);

    normalizeIDs(q);
    normalizeIDs(obj);

    const create = async function() {
        let query = {};
        if (q) {
            query = q;
        } else {
            if (obj._id)
                query._id = obj._id;
        }

        let options;
        if (opt) {
            options = opt;
        } else {
            options = {
                upsert: true
            };
        }

        let toUpdate = {
            $set: obj
        };

        if (obj.$set || obj.$pull) {
            toUpdate = obj
        }

        const result = await collection.updateOne(query, toUpdate, options);

        logger.log(`[${collectionName}] updated`);
        if (cb)
            cb(result);
    }

    create();
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} query          description 
 * @param  {type} cb             description 
 * @return {type}                description 
 */
MRP.read = function(collectionName, query, cb) {
    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "read",
            args: arguments
        });
        return;
    }

    const collection = db.collection(collectionName);

    let read = async () => {
        normalizeIDs(query);
        let storedDocument = await collection.findOne(query);
        cb(storedDocument);
    };
    read();
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} query          description 
 * @param  {type} options        description 
 * @param  {type} paging         description 
 * @param  {type} cb             description 
 * @return {type}                description 
 */
MRP.find = function(collectionName, query, options, paging, cb) {
    if (Array.isArray(query))
        query = undefined;
    if (Array.isArray(options))
        options = undefined;

    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "find",
            args: arguments
        });
        return;
    }

    const collection = db.collection(collectionName);
    let find = async () => {
        normalizeIDs(query);
        const cursor = await collection.find(query, options);
        if ((await cursor.count()) === 0) {
            logger.log(`No documents found for collection [${collectionName}] with query [${JSON.stringify(query)}] and options [${JSON.stringify(options)}]`);
            cb(null);
            return;
        }

        if (paging && paging.skip !== false)
            cursor.skip(paging.skip);
        if (paging && paging.limit !== false)
            cursor.limit(paging.limit);

        let documents = await cursor.toArray();
        cb(documents);
    };
    find();
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} query          description 
 * @param  {type} cb             description 
 * @return {type}                description 
 */
MRP.aggregate = function(collectionName, query, cb) {
    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "aggregate",
            args: arguments
        });
        return;
    }

    const collection = db.collection(collectionName);
    let find = async () => {
        normalizeIDs(query);
        const cursor = await collection.aggregate(query);

        let documents = await cursor.toArray();

        cb(documents);
    };
    find();
};


/**
 * MRP - description
 *  
 * @memberof MRP_SERVER
 * @param  {type} collectionName description 
 * @param  {type} query          description 
 * @param  {type} cb             description 
 * @return {type}                description 
 */
MRP.count = function(collectionName, query, cb) {
    if (!db) {
        //DB not connected stash changes
        stashedCalls.push({
            action: "count",
            args: arguments
        });
        return;
    }

    const collection = db.collection(collectionName);
    let count = async () => {
        normalizeIDs(query);
        const count = await collection.countDocuments(query);
        cb(count);
    };
    count();
};

let normalizeIDs = (obj) => {
    if (!obj)
        return;

    for (let k in obj) {
        if (Array.isArray(obj[k])) {
            for (let i in obj[k]) {
                normalizeIDs(obj[k][i]);
            }
        } else if (typeof obj[k] == 'object') {
            if (obj[k] && obj[k]._bsontype && obj[k]._bsontype == "ObjectID") {
                obj[k] = MRP.toObjectId(obj[k].id);
            } else {
                normalizeIDs(obj[k]);
            }
        }
    }
};

// Use connect method to connect to the server
client.connect(function(err) {
    if (err)
        logger.log(err);
    else
        logger.log('Connected successfully to server');

    db = client.db(dbName);

    if (stashedCalls && stashedCalls.length > 0) {
        for (let call of stashedCalls) {
            MRP[call.action].apply(this, call.args);
        }
        stashedCalls = [];
    }

    exportObj.client = db;
    emit('mrp:db:connected');
});

// shutdown
on('onResourceStop', (resource) => {
    if (resource == GetCurrentResourceName()) {
        logger.log('Closing DB connection');
        client.close();
        delete MRP.db;
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

onNet('mrp:updateCharacter', (source, character) => {
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
        if (result.modifiedCount > 0) {
            MRP.updateSpawnedChar(source, character);
            logger.log(`mrp:updateCharacter [${character.name} ${character.surname}] updated`);
        }
    }

    update();
});


onNet('mrp:deleteCharacter', (source, charId) => {
    //TODO
    if (!charId)
        return;

    MRP.deleteCharacter(charId);
});

module.exports = exportObj;