MRP = nil;

Citizen.CreateThread(function() 
    while MRP == nil do
        TriggerEvent("mrp:getSharedObject", function(obj) MRP = obj end)    
        Citizen.Wait(200)
    end
end)

MRPShared = {}

local StringCharset = {}
local NumberCharset = {}

for i = 48,  57 do table.insert(NumberCharset, string.char(i)) end
for i = 65,  90 do table.insert(StringCharset, string.char(i)) end
for i = 97, 122 do table.insert(StringCharset, string.char(i)) end

MRPShared.RandomStr = function(length)
	if length > 0 then
		return MRPShared.RandomStr(length-1) .. StringCharset[math.random(1, #StringCharset)]
	else
		return ''
	end
end

MRPShared.RandomInt = function(length)
	if length > 0 then
		return MRPShared.RandomInt(length-1) .. NumberCharset[math.random(1, #NumberCharset)]
	else
		return ''
	end
end

MRPShared.SplitStr = function(str, delimiter)
	local result = { }
	local from  = 1
	local delim_from, delim_to = string.find( str, delimiter, from  )
	while delim_from do
		table.insert( result, string.sub( str, from , delim_from-1 ) )
		from  = delim_to + 1
		delim_from, delim_to = string.find( str, delimiter, from  )
	end
	table.insert( result, string.sub( str, from  ) )
	return result
end

MRPShared.Trim = function(s)
   return (s:gsub("^%s*(.-)%s*$", "%1"))
end

MRPShared.StarterItems = {
    ["phone"] = {amount = 1, item = "phone"},
    ["id_card"] = {amount = 1, item = "id_card"},
    ["driver_license"] = {amount = 1, item = "driver_license"},
}

MRPShared._cachedItems = {}

MRPShared.Items = function(name)
    local item = nil
    local p = promise.new()
    
    if name == nil then
        --get all items from DB
        MRP.find('item', {}, {sort = 'name'}, {skip = false, limit = false}, function(res)
            print('got all items')
            item = res
            p:resolve(true)
        end)
        
        Citizen.Await(p)
        
        return item
    end
    
    if MRPShared._cachedItems[name] ~= nil then
        return MRPShared._cachedItems[name]
    end
    
    if MRP.TriggerServerCallback == nil then
        --server get item directly form DB
        MRP.read('item', {
            name = name
        }, function(res)
            if res ~= nil then
                MRPShared._cachedItems[name] = res
                item = res
            end
            p:resolve(true)
        end)
    else
        --client get items from server
        MRP.TriggerServerCallback('mrp:server:read:item', {name}, function(item)
            if res ~= nil then
                MRPShared._cachedItems[name] = res
                item = res
            end
            p:resolve(true)
        end)
    end
    
    Citizen.Await(p)
    
    return item
end

-- // HASH WEAPON ITEMS, NEED SOMETIMES TO GET INFO FOR CLIENT

MRPShared.Weapons = {
	-- // WEAPONS
	[GetHashKey("weapon_unarmed")] 				 = {["name"] = "weapon_unarmed", 		 	  	["label"] = "Fists", 					["weight"] = 1000, 		["type"] = "weapon",	["ammotype"] = nil, 					["image"] = "placeholder.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "Fisticuffs"},
	[GetHashKey("weapon_knife")] 				 = {["name"] = "weapon_knife", 			 	  	["label"] = "Knife", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_knife.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "An instrument composed of a blade fixed into a handle, used for cutting or as a weapon"},
	[GetHashKey("weapon_nightstick")] 			 = {["name"] = "weapon_nightstick", 		 	["label"] = "Nightstick", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_nightstick.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A police officer's club or billy"},
	[GetHashKey("weapon_hammer")] 				 = {["name"] = "weapon_hammer", 			 	["label"] = "Hammer", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_hammer.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "Used for jobs such as breaking things (legs) and driving in nails"},
	[GetHashKey("weapon_bat")] 					 = {["name"] = "weapon_bat", 			 	  	["label"] = "Bat", 					    ["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_bat.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "Used for hitting a ball in sports (or other things)"},
	[GetHashKey("weapon_golfclub")] 			 = {["name"] = "weapon_golfclub", 		 	  	["label"] = "Golfclub", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_golfclub.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A club used to hit the ball in golf"},
	[GetHashKey("weapon_crowbar")] 				 = {["name"] = "weapon_crowbar", 		 	  	["label"] = "Crowbar", 				    ["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_crowbar.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "An iron bar with a flattened end, used as a lever"},
	[GetHashKey("weapon_pistol")] 				 = {["name"] = "weapon_pistol", 			 	["label"] = "Walther P99", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_pistol.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A small firearm designed to be held in one hand"},
	[GetHashKey("weapon_pistol_mk2")] 			 = {["name"] = "weapon_pistol_mk2", 			["label"] = "Pistol Mk II", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_pistolmk2.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "An upgraded small firearm designed to be held in one hand"},
	[GetHashKey("weapon_combatpistol")] 		 = {["name"] = "weapon_combatpistol", 	 	  	["label"] = "Combat Pistol", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_combatpistol.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A combat version small firearm designed to be held in one hand"},
	[GetHashKey("weapon_appistol")] 			 = {["name"] = "weapon_appistol", 		 	  	["label"] = "AP Pistol", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_appistol.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A small firearm designed to be held in one hand that is automatic"},
	[GetHashKey("weapon_pistol50")] 			 = {["name"] = "weapon_pistol50", 		 	  	["label"] = "Pistol .50 Cal", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_pistol50.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A .50 caliber firearm designed to be held with both hands"},
	[GetHashKey("weapon_microsmg")] 			 = {["name"] = "weapon_microsmg", 		 	  	["label"] = "Micro SMG", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "smg_ammo",				["image"] = "weapon_microsmg.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A handheld lightweight machine gun"},
	[GetHashKey("weapon_smg")] 				 	 = {["name"] = "weapon_smg", 			 	  	["label"] = "SMG", 						["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "smg_ammo",				["image"] = "weapon_smg.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "A handheld lightweight machine gun"},
	[GetHashKey("weapon_assaultsmg")] 			 = {["name"] = "weapon_assaultsmg", 		 	["label"] = "Assault SMG", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "smg_ammo",				["image"] = "weapon_assaultsmg.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "An assault version of a handheld lightweight machine gun"},
	[GetHashKey("weapon_assaultrifle")] 		 = {["name"] = "weapon_assaultrifle", 	 	  	["label"] = "Assault Rifle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_assaultrifle.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A rapid-fire, magazine-fed automatic rifle designed for infantry use"},
	[GetHashKey("weapon_carbinerifle")] 		 = {["name"] = "weapon_carbinerifle", 	 	  	["label"] = "Carbine Rifle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_carbinerifle.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A lightweight automatic rifle"},
	[GetHashKey("weapon_advancedrifle")] 		 = {["name"] = "weapon_advancedrifle", 	 	  	["label"] = "Advanced Rifle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_advancedrifle.png", ["unique"] = true, 		["useable"] = false, 	["description"] = "An assault version of a rapid-fire, magazine-fed automatic rifle designed for infantry use"},
	[GetHashKey("weapon_mg")] 					 = {["name"] = "weapon_mg", 				 	["label"] = "Machinegun", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "mg_ammo",				["image"] = "weapon_mg.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "An automatic gun that fires bullets in rapid succession for as long as the trigger is pressed"},
	[GetHashKey("weapon_combatmg")] 			 = {["name"] = "weapon_combatmg", 		 	  	["label"] = "Combat MG", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "mg_ammo",				["image"] = "weapon_combatmg.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A combat version of an automatic gun that fires bullets in rapid succession for as long as the trigger is pressed"},
	[GetHashKey("weapon_pumpshotgun")] 			 = {["name"] = "weapon_pumpshotgun", 	 	  	["label"] = "Pump Shotgun", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_pumpshotgun.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A pump-action smoothbore gun for firing small shot at short range"},
	[GetHashKey("weapon_sawnoffshotgun")] 		 = {["name"] = "weapon_sawnoffshotgun", 	 	["label"] = "Sawn-off Shotgun", 		["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_sawnoffshotgun.png", ["unique"] = true, 	["useable"] = false, 	["description"] = "A sawn-off smoothbore gun for firing small shot at short range"},
	[GetHashKey("weapon_assaultshotgun")] 		 = {["name"] = "weapon_assaultshotgun", 	 	["label"] = "Assault Shotgun", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_assaultshotgun.png", ["unique"] = true, 	["useable"] = false, 	["description"] = "An assault version of asmoothbore gun for firing small shot at short range"},
	[GetHashKey("weapon_bullpupshotgun")] 		 = {["name"] = "weapon_bullpupshotgun", 	 	["label"] = "Bullpup Shotgun", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_bullpupshotgun.png", ["unique"] = true, 	["useable"] = false, 	["description"] = "A compact smoothbore gun for firing small shot at short range"},
	[GetHashKey("weapon_stungun")] 				 = {["name"] = "weapon_stungun", 		 	  	["label"] = "Taser", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_taser.png", 		 ["unique"] = true, 	["useable"] = false, 	["description"] = "A weapon firing barbs attached by wires to batteries, causing temporary paralysis"},
	[GetHashKey("weapon_sniperrifle")] 			 = {["name"] = "weapon_sniperrifle", 	 	  	["label"] = "Sniper Rifle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_sniperrifle.png", 	 ["unique"] = true, 	["useable"] = false, 	["description"] = "A high-precision, long-range rifle"},
	[GetHashKey("weapon_heavysniper")] 			 = {["name"] = "weapon_heavysniper", 	 	  	["label"] = "Heavy Sniper", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_heavysniper.png", 	 ["unique"] = true, 	["useable"] = false, 	["description"] = "An upgraded high-precision, long-range rifle"},
	[GetHashKey("weapon_remotesniper")] 		 = {["name"] = "weapon_remotesniper", 	 	  	["label"] = "Remote Sniper", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo_REMOTE",	["image"] = "weapon_remotesniper.png", 	 ["unique"] = true, 	["useable"] = false, 	["description"] = "A portable high-precision, long-range rifle"},
	[GetHashKey("weapon_grenadelauncher")] 		 = {["name"] = "weapon_grenadelauncher", 	  	["label"] = "Grenade Launcher", 		["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_GRENADELAUNCHER",	["image"] = "weapon_grenadelauncher.png", ["unique"] = true, 	["useable"] = false, 	["description"] = "A weapon that fires a specially-designed large-caliber projectile, often with an explosive, smoke or gas warhead"},
	[GetHashKey("weapon_grenadelauncher_smoke")] = {["name"] = "weapon_grenadelauncher_smoke", 	["label"] = "Smoke Grenade Launcher", 	["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_GRENADELAUNCHER",	["image"] = "weapon_smokegrenade.png", 	 ["unique"] = true, 	["useable"] = false, 	["description"] = "A bomb that produces a lot of smoke when it explodes"},
	[GetHashKey("weapon_rpg")] 					 = {["name"] = "weapon_rpg", 			      	["label"] = "RPG", 						["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_RPG",				["image"] = "weapon_rpg.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "A rocket-propelled grenade launcher"},
	[GetHashKey("weapon_minigun")] 				 = {["name"] = "weapon_minigun", 		      	["label"] = "Minigun", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_MINIGUN",			["image"] = "weapon_minigun.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A portable machine gun consisting of a rotating cluster of six barrels and capable of variable rates of fire of up to 6,000 rounds per minute"},
	[GetHashKey("weapon_grenade")] 				 = {["name"] = "weapon_grenade", 		      	["label"] = "Grenade", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_grenade.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A handheld throwable bomb"},
	[GetHashKey("weapon_stickybomb")] 			 = {["name"] = "weapon_stickybomb", 		    ["label"] = "C4", 						["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_stickybomb.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "An explosive charge covered with an adhesive that when thrown against an object sticks until it explodes"},
	[GetHashKey("weapon_smokegrenade")] 		 = {["name"] = "weapon_smokegrenade", 	      	["label"] = "Smoke Grenade", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_c4.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "An explosive charge that can be remotely detonated"},
	[GetHashKey("weapon_bzgas")] 				 = {["name"] = "weapon_bzgas", 			      	["label"] = "BZ Gas", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_bzgas.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A cannister of gas that causes extreme pain"},
	[GetHashKey("weapon_molotov")] 				 = {["name"] = "weapon_molotov", 		      	["label"] = "Molotov", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_molotov.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A crude bomb made of a bottle filled with a flammable liquid and fitted with a wick for lighting"},
	[GetHashKey("weapon_fireextinguisher")] 	 = {["name"] = "weapon_fireextinguisher",      	["label"] = "Fire Extinguisher", 		["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_fireextinguisher.png", 	["unique"] = true, 	["useable"] = false, 	["description"] = "A portable device that discharges a jet of water, foam, gas, or other material to extinguish a fire"},
	[GetHashKey("weapon_petrolcan")] 			 = {["name"] = "weapon_petrolcan", 		 	  	["label"] = "Petrol Can", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_PETROLCAN",		["image"] = "weapon_petrolcan.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A robust liquid container made from pressed steel"},
	[GetHashKey("weapon_briefcase")] 			 = {["name"] = "weapon_briefcase", 		 	  	["label"] = "Briefcase", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_briefcase.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A briefcase"},
	[GetHashKey("weapon_briefcase_02")] 		 = {["name"] = "weapon_briefcase_02", 	 	  	["label"] = "Briefcase", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_briefcase2.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A briefcase"},
	[GetHashKey("weapon_ball")] 				 = {["name"] = "weapon_ball", 			 	  	["label"] = "Ball", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_BALL",				["image"] = "weapon_ball.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "A solid or hollow spherical or egg-shaped object that is kicked, thrown, or hit in a game"},
	[GetHashKey("weapon_flare")] 				 = {["name"] = "weapon_flare", 			 	  	["label"] = "Flare pistol", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_FLARE",			["image"] = "weapon_flare.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A small pyrotechnic devices used for illumination and signalling"},
	[GetHashKey("weapon_snspistol")] 			 = {["name"] = "weapon_snspistol", 		 	  	["label"] = "SNS Pistol", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_snspistol.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A very small firearm designed to be easily concealed"},
	[GetHashKey("weapon_bottle")] 				 = {["name"] = "weapon_bottle", 			 	["label"] = "Broken Bottle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_bottle.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A broken bottle"},
	[GetHashKey("weapon_gusenberg")] 			 = {["name"] = "weapon_gusenberg", 		 	  	["label"] = "Thompson SMG", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "mg_ammo",				["image"] = "weapon_gusenberg.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "An automatic rifle commonly referred to as a tommy gun"},
	[GetHashKey("weapon_specialcarbine")] 		 = {["name"] = "weapon_specialcarbine", 	 	["label"] = "Special Carbine", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_specialcarbine.png", ["unique"] = true, 	["useable"] = false, 	["description"] = "An extremely versatile assault rifle for any combat situation"},
	[GetHashKey("weapon_heavypistol")] 			 = {["name"] = "weapon_heavypistol", 	 	  	["label"] = "Heavy Pistol", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_heavypistol.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A hefty firearm designed to be held in one hand (or attempted)"},
	[GetHashKey("weapon_bullpuprifle")] 		 = {["name"] = "weapon_bullpuprifle", 	 	  	["label"] = "Bullpup Rifle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_bullpuprifle.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A compact automatic assault rifle"},
	[GetHashKey("weapon_dagger")] 				 = {["name"] = "weapon_dagger", 			 	["label"] = "Dagger", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_dagger.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A short knife with a pointed and edged blade, used as a weapon"},
	[GetHashKey("weapon_vintagepistol")] 		 = {["name"] = "weapon_vintagepistol", 	 	  	["label"] = "Vintage Pistol", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_vintagepistol.png", ["unique"] = true, 		["useable"] = false, 	["description"] = "An antique firearm designed to be held in one hand"},
	[GetHashKey("weapon_firework")] 			 = {["name"] = "weapon_firework", 		 	  	["label"] = "Firework Launcher", 		["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_firework.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A device containing gunpowder and other combustible chemicals that causes a spectacular explosion when ignited"},
	[GetHashKey("weapon_musket")] 			     = {["name"] = "weapon_musket", 			 	["label"] = "Musket", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_musket.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "An infantryman's light gun with a long barrel, typically smooth-bored, muzzleloading, and fired from the shoulder"},
	[GetHashKey("weapon_heavyshotgun")] 		 = {["name"] = "weapon_heavyshotgun", 	 	  	["label"] = "Heavy Shotgun", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_heavyshotgun.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A large smoothbore gun for firing small shot at short range"},
	[GetHashKey("weapon_marksmanrifle")] 		 = {["name"] = "weapon_marksmanrifle", 	 	  	["label"] = "Marksman Rifle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_marksmanrifle.png", ["unique"] = true, 		["useable"] = false, 	["description"] = "A very accurate single-fire rifle"},
	[GetHashKey("weapon_hominglauncher")] 		 = {["name"] = "weapon_hominglauncher", 	 	["label"] = "Homing Launcher", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_STINGER",			["image"] = "weapon_hominglauncher.png", ["unique"] = true, 	["useable"] = false, 	["description"] = "A weapon fitted with an electronic device that enables it to find and hit a target"},
	[GetHashKey("weapon_proxmine")] 			 = {["name"] = "weapon_proxmine", 		 	  	["label"] = "Proxmine Grenade", 		["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_proximitymine.png", ["unique"] = true, 		["useable"] = false, 	["description"] = "A bomb placed on the ground that detonates when going within its proximity"},
	[GetHashKey("weapon_snowball")] 		     = {["name"] = "weapon_snowball", 		 	  	["label"] = "Snowball", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_snowball.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A ball of packed snow, especially one made for throwing at other people for fun"},
	[GetHashKey("weapon_flaregun")] 			 = {["name"] = "weapon_flaregun", 		 	  	["label"] = "Flare Gun", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "AMMO_FLARE",			["image"] = "weapon_flaregun.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A handgun for firing signal rockets"},
	[GetHashKey("weapon_garbagebag")] 			 = {["name"] = "weapon_garbagebag", 		 	["label"] = "Garbage Bag", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_garbagebag.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A garbage bag"},
	[GetHashKey("weapon_handcuffs")] 			 = {["name"] = "weapon_handcuffs", 		 	  	["label"] = "Handcuffs", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_handcuffs.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A pair of lockable linked metal rings for securing a prisoner's wrists"},
	[GetHashKey("weapon_combatpdw")] 			 = {["name"] = "weapon_combatpdw", 		 	  	["label"] = "Combat PDW", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "smg_ammo",				["image"] = "weapon_combatpdw.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A combat version of a handheld lightweight machine gun"},
	[GetHashKey("weapon_marksmanpistol")] 		 = {["name"] = "weapon_marksmanpistol", 	 	["label"] = "Marksman Pistol", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_marksmanpistol.png", ["unique"] = true, 	["useable"] = false, 	["description"] = "A very accurate small firearm designed to be held in one hand"},
	[GetHashKey("weapon_knuckle")] 				 = {["name"] = "weapon_knuckle", 		 	  	["label"] = "Knuckle", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_knuckle.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A metal guard worn over the knuckles in fighting, especially to increase the effect of the blows"},
	[GetHashKey("weapon_hatchet")] 				 = {["name"] = "weapon_hatchet", 		 	  	["label"] = "Hatchet", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_hatchet.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A small axe with a short handle for use in one hand"},
	[GetHashKey("weapon_railgun")] 				 = {["name"] = "weapon_railgun", 		 	  	["label"] = "Railgun", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_railgun.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A weapon that uses electromagnetic force to launch high velocity projectiles"},
	[GetHashKey("weapon_machete")] 				 = {["name"] = "weapon_machete", 		 	  	["label"] = "Machete", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_machete.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A broad, heavy knife used as a weapon"},
	[GetHashKey("weapon_machinepistol")] 		 = {["name"] = "weapon_machinepistol", 	 	  	["label"] = "Tec-9", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_machinepistol.png", ["unique"] = true, 		["useable"] = false, 	["description"] = "A self-loading pistol capable of burst or fully automatic fire"},
	[GetHashKey("weapon_switchblade")] 			 = {["name"] = "weapon_switchblade", 	 	  	["label"] = "Switchblade", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_switchblade.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A knife with a blade that springs out from the handle when a button is pressed"},
	[GetHashKey("weapon_revolver")] 			 = {["name"] = "weapon_revolver", 		 	  	["label"] = "Revolver", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "pistol_ammo",			["image"] = "weapon_revolver.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A pistol with revolving chambers enabling several shots to be fired without reloading"},
	[GetHashKey("weapon_dbshotgun")] 			 = {["name"] = "weapon_dbshotgun", 		 	  	["label"] = "Double-barrel Shotgun", 	["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_dbshotgun.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A shotgun with two parallel barrels, allowing two single shots to be fired in quick succession"},
	[GetHashKey("weapon_compactrifle")] 		 = {["name"] = "weapon_compactrifle", 	 	  	["label"] = "Compact Rifle", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "rifle_ammo",			["image"] = "weapon_compactrifle.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A compact version of an assault rifle"},
	[GetHashKey("weapon_autoshotgun")] 			 = {["name"] = "weapon_autoshotgun", 	 	  	["label"] = "Auto Shotgun", 			["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "shotgun_ammo",			["image"] = "weapon_autoshotgun.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A shotgun capable of rapid continous fire"},
	[GetHashKey("weapon_battleaxe")] 			 = {["name"] = "weapon_battleaxe", 		 	  	["label"] = "Battle Axe", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_battleaxe.png", 	["unique"] = true, 		["useable"] = false, 	["description"] = "A large broad-bladed axe used in ancient warfare"},
	[GetHashKey("weapon_compactlauncher")] 		 = {["name"] = "weapon_compactlauncher",  	  	["label"] = "Compact Launcher", 		["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_compactlauncher.png", 	["unique"] = true, 	["useable"] = false, 	["description"] = "A compact grenade launcher"},
	[GetHashKey("weapon_minismg")] 				 = {["name"] = "weapon_minismg", 		 	  	["label"] = "Mini SMG", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = "smg_ammo",				["image"] = "weapon_minismg.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A mini handheld lightweight machine gun"},
	[GetHashKey("weapon_pipebomb")] 			 = {["name"] = "weapon_pipebomb", 		 	  	["label"] = "Pipe bom", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_pipebomb.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A homemade bomb, the components of which are contained in a pipe"},
	[GetHashKey("weapon_poolcue")] 				 = {["name"] = "weapon_poolcue", 		 	  	["label"] = "Poolcue", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_poolcue.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A stick used to strike a ball, usually the cue ball (sometimes)"},
	[GetHashKey("weapon_wrench")] 				 = {["name"] = "weapon_wrench", 			 	["label"] = "Wrench", 					["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "weapon_wrench.png", 		["unique"] = true, 		["useable"] = false, 	["description"] = "A tool used for gripping and turning nuts, bolts, pipes, etc"},
	[GetHashKey("weapon_bread")] 				 = {["name"] = "weapon_bread", 				 	["label"] = "Baquette", 				["weight"] = 1000, 		["type"] = "weapon", 	["ammotype"] = nil,						["image"] = "baquette.png", 			["unique"] = true, 		["useable"] = false, 	["description"] = "Bread..?"},
}

-- Gangs
MRPShared.Gangs = {
	["none"] = {
		label = "No Gang"
	},
	["lostmc"] = {
		label = "The Lost MC"
	},
	["ballas"] = {
		label = "Ballas"
	},
	["vagos"] = {
		label = "Vagos"
	},
	["cartel"] = {
		label = "Cartel"
	},
	["familes"] = {
		label = "Families"
	},
	["triads"] = {
		label = "Triads"
	}
}

-- Jobs
MRPShared.Jobs = {
	["unemployed"] = {
		label = "Civilian",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Freelancer",
                payment = 10
            },
        },
	},
	["police"] = {
		label = "Law Enforcement",
		defaultDuty = true,
		bossmenu = vector3(448.4, -973.2, 30.6),
		grades = {
            ['0'] = {
                name = "Recruit",
                payment = 50
            },
			['1'] = {
                name = "Officer",
                payment = 75
            },
			['2'] = {
                name = "Sergeant",
                payment = 100
            },
			['3'] = {
                name = "Lieutenant",
                payment = 125
            },
			['4'] = {
                name = "Chief",
				isboss = true,
                payment = 150
            },
        },
	},
	["ambulance"] = {
		label = "EMS",
		defaultDuty = true,
		bossmenu = vector3(270.5, -1363.0, 23.5),
		grades = {
            ['0'] = {
                name = "Recruit",
                payment = 50
            },
			['1'] = {
                name = "Paramedic",
                payment = 75
            },
			['2'] = {
                name = "Doctor",
                payment = 100
            },
			['3'] = {
                name = "Surgeon",
                payment = 125
            },
			['4'] = {
                name = "Chief",
				isboss = true,
                payment = 150
            },
        },
	},
	["realestate"] = {
		label = "Real Estate",
		defaultDuty = true,
		bossmenu = vector3(-124.786, -641.486, 167.820),
		grades = {
            ['0'] = {
                name = "Recruit",
                payment = 50
            },
			['1'] = {
                name = "House Sales",
                payment = 75
            },
			['2'] = {
                name = "Business Sales",
                payment = 100
            },
			['3'] = {
                name = "Broker",
                payment = 125
            },
			['4'] = {
                name = "Manager",
				isboss = true,
                payment = 150
            },
        },
	},
	["taxi"] = {
		label = "Taxi",
		defaultDuty = true,
		bossmenu = vector3(903.32, -170.55, 74.0),
		grades = {
            ['0'] = {
                name = "Recruit",
                payment = 50
            },
			['1'] = {
                name = "Driver",
                payment = 75
            },
			['2'] = {
                name = "Event Driver",
                payment = 100
            },
			['3'] = {
                name = "Sales",
                payment = 125
            },
			['4'] = {
                name = "Manager",
				isboss = true,
                payment = 150
            },
        },
	},
	["cardealer"] = {
		label = "Vehicle Dealer",
		defaultDuty = true,
		bossmenu = vector3(-32.0, -1114.2, 25.4),
		grades = {
            ['0'] = {
                name = "Recruit",
                payment = 50
            },
			['1'] = {
                name = "Showroom Sales",
                payment = 75
            },
			['2'] = {
                name = "Business Sales",
                payment = 100
            },
			['3'] = {
                name = "Finance",
                payment = 125
            },
			['4'] = {
                name = "Manager",
				isboss = true,
                payment = 150
            },
        },
	},
	["mechanic"] = {
		label = "Mechanic",
		defaultDuty = true,
		bossmenu = vector3(-342.291, -133.370, 39.009),
		grades = {
            ['0'] = {
                name = "Recruit",
                payment = 50
            },
			['1'] = {
                name = "Novice",
                payment = 75
            },
			['2'] = {
                name = "Experienced",
                payment = 100
            },
			['3'] = {
                name = "Advanced",
                payment = 125
            },
			['4'] = {
                name = "Manager",
				isboss = true,
                payment = 150
            },
        },
	},
	["judge"] = {
		label = "Honorary",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Judge",
                payment = 100
            },
        },
	},
	["lawyer"] = {
		label = "Law Firm",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Associate",
                payment = 50
            },
        },
	},
	["reporter"] = {
		label = "Reporter",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Journalist",
                payment = 50
            },
        },
	},
	["trucker"] = {
		label = "Trucker",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Driver",
                payment = 50
            },
        },
	},
	["tow"] = {
		label = "Towing",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Driver",
                payment = 50
            },
        },
	},
	["garbage"] = {
		label = "Garbage",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Collector",
                payment = 50
            },
        },
	},
	["vineyard"] = {
		label = "Vineyard",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Picker",
                payment = 50
            },
        },
	},
	["hotdog"] = {
		label = "Hotdog",
		defaultDuty = true,
		grades = {
            ['0'] = {
                name = "Sales",
                payment = 50
            },
        },
	},
}