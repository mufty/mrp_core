let RESOURCE_NAME = GetCurrentResourceName();
let nativeLog = console.log;

mrp_logger = {
    log: function(err, ...args) {
        let date = new Date();
        if (!args || args.length < 1)
            nativeLog('^2' + RESOURCE_NAME + '::^5' + date.toUTCString() + ':: ^1' + err + '^7');
        else
            nativeLog('^2' + RESOURCE_NAME + '::^5' + date.toUTCString() + ':: ^1' + err + '^7', args);
    },
    debug: function(err, ...args) {
        let debugOn = GetConvar('mrp_debug', 'false');
        if (debugOn == 'false')
            return;

        let date = new Date();
        if (!args || args.length < 1)
            nativeLog('^2' + RESOURCE_NAME + '::^5' + date.toUTCString() + ':: ^1' + err + '^7');
        else
            nativeLog('^2' + RESOURCE_NAME + '::^5' + date.toUTCString() + ':: ^1' + err + '^7', args);
    }
};

console.log = mrp_logger.log;
console.debug = mrp_logger.debug;