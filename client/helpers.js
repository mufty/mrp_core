/**
 * @namespace utils
 */
utils = {

    /**    
     * InvokeNative - description    
     *      
     * @memberof utils
     * @return {type}  description     
     */
    InvokeNative: function() {
        let args = arguments;
        return new Promise(resolve => {
            emit('mrp:lua:invokeNative', args, (returnVal) => {
                resolve(returnVal);
            });
        });
    },

    /**     
     * CreateThread - description    
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
     *      
     * @memberof utils
     * @param  {type} callback description     
     * @return {type}          description     
     */
    CreateThread: function(callback) {
        emit('mrp:lua:createThread', callback);
    },

    /**    
     * sleep - description    
     *      
     * @memberof utils
     * @param  {type} ms description     
     * @return {type}    description     
     */
    sleep: function(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },

    /**    
     * wait - description    
     *      
     * @memberof utils
     * @param  {type} ms description     
     * @return {type}    description     
     */
    wait: function(ms) {
        return new Promise((resolve) => {
            emit('mrp:lua:wait', ms, () => {
                resolve();
            });
        });
    },

    /**    
     * getRandomInt - description    
     *      
     * @memberof utils
     * @param  {type} min description     
     * @param  {type} max description     
     * @return {type}     description     
     */
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**    
     * getAllPlayersInVehicle - description    
     *      
     * @memberof utils
     * @param  {type} vehicle description     
     * @return {type}         description     
     */
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

        if (!IsVehicleSeatFree(vehicle, -1)) {
            let pedInSeat = GetPedInVehicleSeat(vehicle, -1);
            let pid = NetworkGetPlayerIndexFromPed(pedInSeat);
            let playerServerId = GetPlayerServerId(pid);
            players.push(playerServerId);
        }

        return players;
    }
};