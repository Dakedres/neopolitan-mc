let isKube = this.global
const Item = isKube ? Item : { of: id => id.split(' ').pop() }

// Util functions

const genericStage = (mod, ...patterns) =>
  patterns.reduce((out, pattern) => {
    // Regex to grab the item wrapped in paranthenses
    out[/.*\((\w*?)\).*/.exec(pattern)[1]] = {
      reveal: [ new RegExp(`${mod}:${pattern}$`) ]
    }

    return out
  }, {})

const dynArray = items => typeof items[0] == 'object' ? items[0] : items

const materialFrom = (mod, ...names) =>
	dynArray(names).map(name => new RegExp(`${mod}:(.*_|)${name}.*?$`) )

const materialStage = (mod, ...names) =>
  dynArray(names).reduce((out, name) => {
    out[name] = {
      reveal: new RegExp(`${mod}:(.*_|)${name}.*?$`)
    }

    return out
  }, {})

const singleStage = (...items) =>
  dynArray(items).reduce((out, reveal) => {
    out[reveal.split(':')[1]] = { reveal }
    return out
  }, {})

const singleFrom = (mod, ...items) =>
  singleStage(dynArray(items).map(i => mod + ':' + i) )

const modStages = (...mods) =>
  dynArray(mods).reduce((out, mod) => {
    out[mod] = { reveal: '@' + mod }
    return out
  }, {})

const mapStages = (stages, mapper) => {
  let out = {}

  for(let key in stages) {
    out[key] = mapper(stages[key])
  }

  return out
}

const singleTrade = (weight = 1, cost = 1, uses) => item => ({
  weight,
  cost,
  uses,
  sell: Item.of(item),
})

// const forMods = (processor, mods, ...args) =>
//   mods.reduce((out, mod) => {
//     let data = processor(mod, ...args)

//     for(let key in data) {
//       let outValue = out[key]

//       if(outValue) {
//         outValue.reveal = outValue.reveal.concat(data[key].reveal)
//       } else {
        
//       }
//     }
//   }, {})

// Gamestages

const gamestages =  {
  ...modStages('create', 'pitchperfect'),
  //   The above is equivalent to:
  // "create": {
  //   "on": "discover",
  //   "reveal": "@create"
  // },
  // ...ect

  ...materialStage('darkerdepths', 'limestone', 'grimstone', 'shale', 'petrified'),
  //   The above is equivalent to:
  // shale: {
  //   on: "discover",
  //   reveal: [
  //     /darkerdepths:.*?_shale$/
  //   ]
  // },
  // grimestone: {
  //   on: "discover",
  //   reveal: [
  //     /darkerdepths:grimestone.*?$/
  //   ]
  // }
  // ...ect

  //   Also an option to similar ends
  // ...genericStage('darkerdepths', '(grimestone).*?', '(.*_|)(shale).*?', '(.*_|)(petrified).*?'),

  insect_bottle: {
    reveal: /buzzier_bees:.*?_bottle$/,
    trades: [
      singleTrade(2)('buzzier_bees:silverfish_bottle')
    ]
  },
                                            
//   ______            _                 _   _             
//  |  ____|          | |               | | (_)            
//  | |__  __  ___ __ | | ___  _ __ __ _| |_ _  ___  _ __  
//  |  __| \ \/ / '_ \| |/ _ \| '__/ _` | __| |/ _ \| '_ \ 
//  | |____ >  <| |_) | | (_) | | | (_| | |_| | (_) | | | |
//  |______/_/\_\ .__/|_|\___/|_|  \__,_|\__|_|\___/|_| |_|
//              | |                                        
//              |_|   
//                                     
  // Alex's Mobs
  ...materialStage('alexsmobs', 'crocodile', 'moose', 'kangaroo', 'dropbear'),
  ...singleFrom('alexsmobs', 'sombrero', 'mimicream'),
  void_worm: {
    //   'on' isn't even needed if it's discover
    // on: "discover",
    or: "alexsmobs:alexsmobs/void_worm_kill",
    reveal: [
      '#alexsmobs:void_worm_drops',
      'alexsmobs:void_worm_beak',
      'alexsmobs:dimensional_carver'
    ]
  },
  frontier_cap: {
    reveal: [
      'alexsmobs:frontier_cap',
      'alexsmobs:raccoon_tail',
      'alexsmobs:bear_fur'
    ]
  },
  banana: {
    reveal: [
      'alexsmobs:banana',
      'alexsmobs:banana_peel',
      'alexsmobs:sopa_de_macaco'
    ]
  },

  glowstone_canyon: {
    reveal: [
      '#infernalexp:glowstone_canyon_blocks'
    ]
  },

  // Endergetic
  ...materialStage('endergetic', 'boof', 'corrock'),
  ...singleStage('endergetic:acidian_lantern'),
  puffbug: {
    reveal: [
      'endergetic:puffbug_hive',
      'endergetic:puffbug_bottle'
    ]
  },
  eumus: {
    reveal: [
      ...materialFrom('endergetic', 'eumus'),
      'endergetic:poismoss'
    ]
  },
  bollom: {
    reveal: [
      'endergetic:bolloom_fruit',
      ...materialFrom('endergetic', 'bolloom_balloon')
    ]
  },
  // booflo: {
  //   reveal: [
  //     'endergetic:boof_block',
  //     'endergetic:boof_hide',
  //     'endergetic:booflo_vest'
  //   ]
  // }

  // Special recipes
  slingshot: {
    reveal: [
      'quark:ravager_hide'
    ],
    revealTrades: singleTrade(2, 24)('supplementaries:slingshot')
  },

  hemp: {
    reveal: [
      'immersiveengineering:hemp_fiber',
      'immersiveengineering:wirecoil_structure_rope',
      'supplementaries:rope',
      'supplementaries:rope_arrow',
      'tetra:modular_toolbelt'
    ],
    revealTrades: [
      {
        cost: 1, 
        sell: Item.of('8x immersiveengineering:seed'), // hemp seed
        weight: 5,
        uses: 2
      }
    ]
  },

  amethyst: {
    of: [
      ...materialFrom('cavesandcliffs', 'amethyst')
    ],
    reveal: [
      'supplementaries:amethyst_arrow',
      'immersiveengineering:silver',
      'chimes:amethyst_chimes'
    ]
  },

  // Discs
  ...mapStages(
    singleStage(
      "alexsmobs:music_disc_daze",
      "alexsmobs:music_disc_thime",
      "cavesandcliffs:music_disc_otherside",
      "infernalexp:music_disc_flush",
      "infernalexp:music_disc_soul_spunk",
      "quark:music_disc_chatter",
      "quark:music_disc_clock",
      "quark:music_disc_crickets",
      "quark:music_disc_drips",
      "quark:music_disc_endermosh",
      "quark:music_disc_fire",
      "quark:music_disc_ocean",
      "quark:music_disc_rain",
      "quark:music_disc_wind",
      "endergetic:music_disc_kilobyte"
    ),
    stage => {
      stage.hidden = true
      return stage
    }
  ),

//   _____                           _   _             
//  |  __ \                         | | (_)            
//  | |  | | ___  ___ ___  _ __ __ _| |_ _  ___  _ __  
//  | |  | |/ _ \/ __/ _ \| '__/ _` | __| |/ _ \| '_ \ 
//  | |__| |  __/ (_| (_) | | | (_| | |_| | (_) | | | |
//  |_____/ \___|\___\___/|_|  \__,_|\__|_|\___/|_| |_|
//
  ...materialStage('supplementaries', 'sign_post', 'flag'),
  // ...forMods(materialStage, [
  //   'decorative_blocks',
  //   'decorative_blocks_abnormals',
  //   'muchmoremodcompat'
  // ], [
  //   // TODO: Make sure the player can encounter each of these
  //   'seat',
  //   'palisade',
  //   'support',
  //   'beam'
  // ]),

  copper: {
    reveal: [
      '#forge:ores/copper',
      '#forge:ingots/copper',
      '#forge:nuggets/copper',
      '#forge:plates/copper',
      '#forge:dusts/copper',
      'create:crushed_copper_ore',
      ...materialFrom('create', 'copper'),
      ...materialFrom('immersiveengineering', 'copper'),
      'immersiveengineering:coil_lv',
      ...materialFrom('cavesandcliffs', 'copper'),
      'chimes:copper_chimes',
      'supplementaries:copper_lantern'
    ]
  },

  sunmetal: {
    reveal: [
      '#forge:ores/electrum',
      '#forge:ingots/electrum',
      '#forge:nuggets/electrum',
      '#forge:plates/electrum',
      '#forge:dusts/electrum',
      ...materialFrom('alloyed', 'bronze'),
      ...materialFrom('architects_palette', 'sunmetal'),
      ...materialFrom('immersiveengineering', 'electrum'),
      'immersiveengineering:coil_mv',
      'moreminecarts:lightspeed_cross_rail'
    ],
    revealTrades: [
      {
        cost: 1,
        sell: '3x kubejs:crushed_sunmetal',
        weight: 2,
        uses: 5
      },
      {
        cost: 4,
        sell: '12x moreminecarts:lightspeed_rail',
        weight: 2,
        uses: 2
      }
    ]
  },

  brass: {
    reveal: [
      '#forge:ores/brass',
      '#forge:ingots/brass',
      '#forge:nuggets/brass',
      '#forge:plates/brass',
      '#forge:dusts/brass',
      ...materialFrom('create', 'brass')
    ],
    trades: singleTrade(3, 2, 2)('3x create:brass_ingot')
  },

  // Stones
  ...materialStage('create', 'gabbro', 'dolomite'),
  ...materialStage('darkerdepths', 'grimestone', 'limestone'),
  ...materialStage('cavesandcliffs', 'deepslate'),
  ...materialStage('infernalexp', 'soul_stone'),

  // Planks
  ...materialStage('enhanced_mushrooms', 'red_mushroom', 'brown_mushroom', 'glowshroom'),
  ...materialStage('endergetic', 'poise'),

  honey_pot: {
    of: [
      'minecraft:honeycomb',
      'minecraft:honey_block'
    ],
    reveal: [
      'buzzier_bees:honey_pot',
    ]
  },
  candles: {
    of: [
      'minecraft:honeycomb',
      'quark:tallow',
      '#buzzier_bees:candles'
    ],
    reveal: '#buzzier_bees:candles',
    trades: [
      ...[
        'buzzier_bees:lily_of_the_valley_scented_candle',
        'buzzier_bees:buttercup_scented_candle',
        'buzzier_bees:pink_clover_scented_candle',
      ].map(singleTrade() ),
      singleTrade(2, 1, 5)('2x buzzier_bees:candle')
    ]
  },

//   _______          _     
//  |__   __|        | |    
//     | | ___   ___ | |___ 
//     | |/ _ \ / _ \| / __|
//     | | (_) | (_) | \__ \
//     |_|\___/ \___/|_|___/                     
// 
  sweets: {
    reveal: [
      'buzzier_bees:honey_bread',
      'create:honeyed_apple',
      'minecraft:honey_bottle'
    ],
    revealTrades: [
      'buzzier_bees:sticky_honey_wand',
      'supplementaries:candy',
      'buzzier_bees:glazed_porkchop',
      'create:honeyed_apple'
    ].map(singleTrade(1, 1, 8) )
  },

  jar: {
    revealTrades: [
      'supplementaries:jar',
      'supplementaries:jar_tinted'
    ].map(singleTrade(2, 2) )
  },

  cage: {
    revealTrades: [
      // he sell monkey
      {
        cost: 19,
        item: Item.of('supplementaries:cage', '{BlockEntityTag:{MobHolder:{EntityData:{Brain:{memories:{}},HurtByTimestamp:0,ForgeData:{specialai:{door_breaking:0b,elite_ai:{},depacify:0b,fiddling:0b,griefing:0b,aggressive:0b,dodge_arrows:0.0d,avoid_explosions:1.4d,rider:0b,call_for_help:1b},challenger_mob_checked:1b},Sitting:0b,Attributes:[{Base:0.0d,Name:"minecraft:generic.knockback_resistance"},{Base:1.0d,Name:"forge:swim_speed"},{Base:16.0d,Modifiers:[{Operation:1,UUID:[I;1227436563,-514177694,-1821864105,-708036451],Amount:0.060202893994683176d,Name:"Random spawn bonus"}],Name:"minecraft:generic.follow_range"},{Base:0.4000000059604645d,Name:"minecraft:generic.movement_speed"},{Base:0.08d,Name:"forge:entity_gravity"}],Invulnerable:0b,FallFlying:0b,ForcedAge:0,PortalCooldown:0,AbsorptionAmount:0.0f,FallDistance:0.0f,InLove:0,CanUpdate:1b,DeathTime:0s,ForcedToSit:0b,BoundingBox:[0.17500001192092896d,0.0626d,0.17500001192092896d,0.824999988079071d,0.8126d,0.824999988079071d],ForgeCaps:{"structure_gel:gel_entity":{portal:"structure_gel:empty"},"enchantwithmob:mob_enchant":{FromOwner:0b,StoredMobEnchants:[]},"citadel:extended_entity_data_citadel":{}},HandDropChances:[0.085f,0.085f],PersistenceRequired:1b,id:"alexsmobs:capuchin_monkey",Age:0,Motion:[0.0d,-0.1552320045166016d,0.0d],HasDart:0b,Health:10.0f,MonkeySitting:0b,KubeJSPersistentData:{},LeftHanded:0b,Air:300s,OnGround:1b,CitadelData:{},Rotation:[0.0f,0.0f],HandItems:[{},{}],ArmorDropChances:[0.085f,0.085f,0.085f,0.085f],Pos:[0.5d,0.0626d,0.5d],fireType:"fire",Command:0,Fire:0s,ArmorItems:[{},{},{},{}],CanPickUpLoot:0b,HurtTime:0s},Scale:0.9615385f,UUID:[I;752439093,-924955118,-1956870487,1647143017],Name:"Capuchin Monkey"}}}'),
        weight: 1
      }
    ]
  },


}

// Trade handling

const ensureArray = i =>
  Array.isArray(i) ? i : [ i ]

{
  let allTrades = {},
      currTrades

  const convertTrades = (trades, content) => {
    if(trades) {
      let newTrades = ensureArray(trades)
      currTrades = currTrades ? currTrades.concat(newTrades) : newTrades

      let out = newTrades.map(
        ({ sell }) => typeof sell === 'object' ? sell.getId() : sell
      )

      return content ? out.concat(ensureArray(content) ) : out
    } else
      return content
  }

  for(let name in gamestages) {
    let stage = gamestages[name]

    currTrades = stage.trades
  
    stage.reveal = convertTrades(stage.revealTrades, stage.reveal)
    stage.of = convertTrades(stage.ofTrades, stage.of)

    console.log('THE:' + name)
    console.log(stage.revealTrades)

    if(currTrades)
      allTrades[name] = currTrades

    gamestages[name] = stage
  }

  if(isKube)
    global.gamestageTrades = allTrades
}

// Gamestage handling

{
  const constants = {
    events: {
      pickup: 'discover',
      advancement: 'advance'
    }
  }

  let data = { pickup: [], advancement: [] },
      tags = {}

  const filterToTag = (stageName, content) => {
    if(typeof content == 'object') {
      let name = 'gamestages:' + stageName

      tags[name] = ensureArray(content)
      return '#' + name
    } else {
      return content
    }
  }

  for(let name in gamestages) {
    let stage = gamestages[name]
        out = stage

    out.name = name
    out.reveal = filterToTag(out.name, out.reveal)

    if(!stage.on)
      stage.on = constants.events.pickup

    // if(stage.notify == undefined)
    //   stage.notify = true

    if(!stage.of) {
      if(stage.on == constants.events.pickup) {
        out.of = out.reveal
      } else {
        throw new Error("Stage missing 'of' descriptor")
      }
    } else {
      out.of = filterToTag(out.name, out.of)
    }

    switch(stage.on) {
      case constants.events.advancement:
        data.advancement.push(out)
        break

      case constants.events.pickup:
        data.pickup.push(out)

        if(out.or)
          data.advancement.push({
            of: out.or,
            hidden: out.hidden,
            name
          })
        break
    }
  }

  global.stageData = data

  console.log('TAG DATA')
  console.log(tags)

  onEvent('item.tags' , event => {
    for(let name in tags) {
      tags[name].forEach(i => event.add(name, i))
    }
  })
}