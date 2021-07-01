on('mrp:client:minigame', (name, data, endEvent) => {
    let msg = {
        type: name,
        data: data,
        endEvent: endEvent
    };
    SetNuiFocus(true, true);
    SendNuiMessage(JSON.stringify(msg));
});