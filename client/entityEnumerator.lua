local entityEnumerator = {
  __gc = function(enum)
    if enum.destructor and enum.handle then
      enum.destructor(enum.handle)
    end
    enum.destructor = nil
    enum.handle = nil
  end
}

local function EnumerateEntities(initFunc, moveFunc, disposeFunc)
  return coroutine.wrap(function()
    local iter, id = initFunc()
    if not id or id == 0 then
      disposeFunc(iter)
      return
    end
    
    local enum = {handle = iter, destructor = disposeFunc}
    setmetatable(enum, entityEnumerator)
    
    local next = true
    repeat
      coroutine.yield(id)
      next, id = moveFunc(iter)
    until not next
    
    enum.destructor, enum.handle = nil, nil
    disposeFunc(iter)
  end)
end

function EnumerateObjects()
  return EnumerateEntities(FindFirstObject, FindNextObject, EndFindObject)
end

function EnumeratePeds()
  return EnumerateEntities(FindFirstPed, FindNextPed, EndFindPed)
end

function EnumerateVehicles()
  return EnumerateEntities(FindFirstVehicle, FindNextVehicle, EndFindVehicle)
end

function EnumeratePickups()
  return EnumerateEntities(FindFirstPickup, FindNextPickup, EndFindPickup)
end

local function ToArray(enumerated)
    local index = 1
    local results = {}
    for vehicle in enumerated do
        results[index] = vehicle
        index = index + 1
    end
    return results
end

local function getClosestEntity(entities)
    local ped = PlayerPedId()
    local playerCoords = GetEntityCoords(ped)
    local closestDistance = 99999
    local entity = nil
    for k, v in pairs(entities) do
        local entityCoords = GetEntityCoords(v)
        local distance = Vdist(playerCoords.x, playerCoords.y, playerCoords.z, entityCoords.x, entityCoords.y, entityCoords.z)
        if distance < closestDistance then
            entity = v
            closestDistance = distance
        end
    end
    return entity
end

exports('EnumerateVehicles', function()
    return ToArray(EnumerateVehicles())
end)
exports('EnumerateObjects', function()
    return ToArray(EnumerateObjects())
end)
exports('EnumeratePeds', function()
    return ToArray(EnumeratePeds())
end)
exports('EnumeratePickups', function()
    return ToArray(EnumeratePickups())
end)
exports('GetClosestVehicle', function()
    local entities = ToArray(EnumerateVehicles())
    return getClosestEntity(entities)
end)
exports('GetClosestPed', function()
    local entities = ToArray(EnumeratePeds())
    return getClosestEntity(entities)
end)
exports('GetClosestPickup', function()
    local entities = ToArray(EnumeratePickups())
    return getClosestEntity(entities)
end)
exports('GetClosestObjects', function()
    local entities = ToArray(EnumerateObjects())
    return getClosestEntity(entities)
end)