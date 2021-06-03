let hudOpen = false;
let tags = {};
RegisterCommand('gamerTags', () => {
    hudOpen = !hudOpen;
    let getActivePlayers = GetActivePlayers();
    for (let pid of getActivePlayers) {
        let playerServerId = GetPlayerServerId(pid);
        if (hudOpen) {
            tags[pid] = CreateMpGamerTagWithCrewColor(pid, "" + playerServerId, false, false, "", 0, 0, 0, 0);

            SetMpGamerTagVisibility(tags[pid], 0, true);
        } else {
            if (tags[pid]) {
                SetMpGamerTagVisibility(tags[pid], 0, false);
                RemoveMpGamerTag(tags[pid]);
                delete tags[pid];
            }
        }
    }
});

RegisterKeyMapping('gamerTags', 'Show information above players head', 'keyboard', 'TAB');