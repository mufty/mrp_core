//TODO maybe move this logic to server

if(config.world.hungerDecay){
	MRP_CLIENT.CreateThread(()=>{
		let cycle = async function(){
			while(true){
				await MRP_CLIENT.sleep(0);

				let character = MRP_CLIENT.GetPlayerData();
				if(!character) {
					await MRP_CLIENT.sleep(config.world.hungerDecayTimer);
					continue;
				}

				character.stats.hunger = Math.round(character.stats.hunger * config.world.hungerDecayMultiplier);
				if(character.stats.hunger < 0)
					character.stats.hunger = 0;
				emitNet('mrp:updateCharacter', character);
				emit('mrp:updateCharacter', character);

				await MRP_CLIENT.sleep(config.world.hungerDecayTimer);
			}
		}
		cycle();
	});
}

if(config.world.thirstDecay){
	MRP_CLIENT.CreateThread(()=>{
		let cycle = async function(){
			while(true){
				await MRP_CLIENT.sleep(0);

				let character = MRP_CLIENT.GetPlayerData();
				if(!character) {
					await MRP_CLIENT.sleep(config.world.thirstDecayTimer);
					continue;
				}

				character.stats.thirst = Math.round(character.stats.thirst * config.world.thirstDecayMultiplier);
				if(character.stats.thirst < 0)
					character.stats.thirst = 0;
				emitNet('mrp:updateCharacter', character);
				emit('mrp:updateCharacter', character);

				await MRP_CLIENT.sleep(config.world.thirstDecayTimer);
			}
		}
		cycle();
	});
}