
AddEventHandler("mrp:lua:invokeNative", function(args, callback)
    local returnVal = Citizen.InvokeNative(unpack(args))
    callback(returnVal)
end)

AddEventHandler("mrp:lua:createThread", function(callback)
    Citizen.CreateThread(function()
        callback()
    end)
end)
