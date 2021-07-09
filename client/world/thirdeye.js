function triggerUI(showUI) {
    let show = "showEye";
    if (!showUI) {
        show = "hideEye";
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
    } else {
        SetNuiFocus(true, true);
        SetNuiFocusKeepInput(true);
    }
    let data = {
        type: show
    };
    SendNuiMessage(JSON.stringify(data));
}

let menuOpen = false;
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
        } else {
            //enable mouse lookaround when menu's opened
            EnableControlAction(1, 1, true);
            EnableControlAction(1, 2, true);
            EnableControlAction(1, 4, true);
            EnableControlAction(1, 6, true);
        }

        if (IsControlJustPressed(1, KEYBOARD_KEYBIND) && !menuOpen) {
            menuOpen = true;
            triggerUI(true);
        } else if (IsControlJustReleased(1, KEYBOARD_KEYBIND) && menuOpen) {
            menuOpen = false;
            triggerUI(false);
        }
    }
}, 0);