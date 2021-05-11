
AddEventHandler("mrp:invokeNative", function(args, callback)
    local returnVal = Citizen.InvokeNative(unpack(args))
    callback(returnVal)
end)

AddEventHandler("mrp:createThread", function(callback)
    Citizen.CreateThread(function()
        callback()
    end)
end)
