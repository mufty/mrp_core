
AddEventHandler("mrp:lua:invokeNative", function(args, callback)
    local returnVal = Citizen.InvokeNative(unpack(args))
    callback(returnVal)
end)

AddEventHandler("mrp:lua:createThread", function(callback)
    Citizen.CreateThread(function()
        callback()
    end)
end)

AddEventHandler("mrp:lua:wait", function(waitFor, callback)
    Citizen.Wait(waitFor);
    callback();
end)

--pvp
--[[Citizen.CreateThread(function()
	while true do
		Citizen.Wait(0)
        local ped = PlayerPedId()
        if ped ~= nil then
            SetCanAttackFriendly(ped, true, false)
    		NetworkSetFriendlyFireOption(true)
        end
	end
end)

AddEventHandler("playerSpawned", function(spawn)
	local ped = PlayerPedId()
	SetCanAttackFriendly(ped, true, true)
	NetworkSetFriendlyFireOption(true)
end)]]--
