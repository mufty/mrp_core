let mod = {
    log: function(err) {
        let date = new Date();
        print('^5' + date.toUTCString() + ':: ^1' + err + '^7');
    }
};

module.exports = mod;