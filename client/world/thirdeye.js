let menuOpen = false;
onNet('mrp:thirdeye:addMenuItem', (data) => {
    data.type = "thirdeyeAdd";
    SendNuiMessage(JSON.stringify(data));
});

onNet('mrp:thirdeye:removeMenuItem', (data) => {
    data.type = "thirdeyeRemove";
    SendNuiMessage(JSON.stringify(data));
});

function triggerUI(showUI) {
    if (MRP_CLIENT.getPlayerMetadata('inMenu'))
        return;
    let show = "showEye";
    if (!showUI && menuOpen) {
        show = "hideEye";
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
        menuOpen = false;
    } else if (showUI && !menuOpen) {
        SetNuiFocus(true, true);
        SetNuiFocusKeepInput(true);
        menuOpen = true;
    }
    let data = {
        type: show
    };
    SendNuiMessage(JSON.stringify(data));
}

RegisterNuiCallbackType('closeEye');
on('__cfx_nui:closeEye', (data, cb) => {
    cb({});
    triggerUI(false);
});

const KEYBOARD_KEYBIND = 19
setInterval(() => {
    const ped = PlayerPedId();
    const vehicle = GetVehiclePedIsIn(ped, false);

    if (ped && vehicle == 0) {
        if (menuOpen) {
            //disable mouse lookaround when menu's opened
            DisableControlAction(1, 1, menuOpen);
            DisableControlAction(1, 2, menuOpen);
            DisableControlAction(1, 4, menuOpen);
            DisableControlAction(1, 6, menuOpen);
            DisableControlAction(1, 24, menuOpen); // left click attack
        } else {
            //enable mouse lookaround when menu's opened
            EnableControlAction(1, 1, true);
            EnableControlAction(1, 2, true);
            EnableControlAction(1, 4, true);
            EnableControlAction(1, 6, true);
            EnableControlAction(1, 24, true);
        }

        if (IsControlJustPressed(1, KEYBOARD_KEYBIND) && !menuOpen) {
            triggerUI(true);
        } else if (IsControlJustReleased(1, KEYBOARD_KEYBIND) && menuOpen) {
            triggerUI(false);
        }
    }
}, 0);