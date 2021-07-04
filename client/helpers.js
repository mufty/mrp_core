utils = {
    InvokeNative: function() {
        let args = arguments;
        return new Promise(resolve => {
            emit('mrp:lua:invokeNative', args, (returnVal) => {
                resolve(returnVal);
            });
        });
    },

    /**
     * Example with infinite while cycle:
     * MRP_CLIENT.CreateThread(()=>{
     *      let cycle = async function(){
     *          let x = 0;
     *          while(true){
     *              x++;
     *              print(x);
     *              await MRP_CLIENT.sleep(2000);
     *          }
     *      }
     *      cycle();
     * });
     */
    CreateThread: function(callback) {
        emit('mrp:lua:createThread', callback);
    },
    sleep: function(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    wait: function(ms) {
        return new Promise((resolve) => {
            emit('mrp:lua:wait', ms, () => {
                resolve();
            });
        });
    },
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getAllPlayersInVehicle: function(vehicle) {
        let seatCount = GetVehicleMaxNumberOfPassengers(vehicle);
        let players = [];
        for (let i = 0; i < seatCount; i++) {
            let seatFree = IsVehicleSeatFree(vehicle, i);
            let pedInSeat = GetPedInVehicleSeat(vehicle, i);
            let pid = NetworkGetPlayerIndexFromPed(pedInSeat);
            let playerServerId = GetPlayerServerId(pid);
            players.push(playerServerId);
        }
        return players;
    }
};