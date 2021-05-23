--[[
1 : WANTED_STARS
2 : WEAPON_ICON
3 : CASH
4 : MP_CASH
5 : MP_MESSAGE
6 : VEHICLE_NAME
7 : AREA_NAME
8 : VEHICLE_CLASS
9 : STREET_NAME
10 : HELP_TEXT
11 : FLOATING_HELP_TEXT_1
12 : FLOATING_HELP_TEXT_2
13 : CASH_CHANGE
14 : RETICLE
15 : SUBTITLE_TEXT
16 : RADIO_STATIONS
17 : SAVING_GAME
18 : GAME_STREAM
19 : WEAPON_WHEEL
20 : WEAPON_WHEEL_STATS
21 : HUD_COMPONENTS
22 : HUD_WEAPONS
]]--

function Split(s, delimiter)
    result = {};
    for match in (s..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match);
    end
    return result;
end

local loadFile= LoadResourceFile(GetCurrentResourceName(), "config/client.json")
local config = {}
config = json.decode(loadFile)

Citizen.CreateThread(function()
	while true do
		Citizen.Wait(0)
        local pID = PlayerId()
        if ped ~= nil then
            SetPlayerHealthRechargeMultiplier(pID, config.world.playerHealthRechargeMultiplier);
        end
        local convarValue = GetConvar("mrp:hideHudComps", "69")
        if convarValue ~= "69" then
            local splitStr = Split(convarValue, ",")
            for k in pairs(splitStr) do
                HideHudComponentThisFrame(tonumber(splitStr[k]))
            end
        end
	end
end)
