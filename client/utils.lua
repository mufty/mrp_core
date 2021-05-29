
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

AddEventHandler("mrp:lua:taskPlayAnim", function(ped, animDictionary, animationName, blendInSpeed, blendOutSpeed, duration, flag, playbackRate, lockX, lockY, lockZ)
    RequestAnimDict(animDictionary)
    while not HasAnimDictLoaded(animDictionary) do
        Citizen.Wait(100)
    end
    
    TaskPlayAnim(ped, animDictionary, animationName, blendInSpeed + 0.0, blendOutSpeed + 0.0, duration, flag, playbackRate, lockX, lockY, lockZ)
    Citizen.Wait(0)
end)
