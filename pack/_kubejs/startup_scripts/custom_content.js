onEvent('item.registry', event => {
  // The texture for this item has to be placed in kubejs/assets/kubejs/textures/item/test_item.png
  // If you want a custom item model, you can create one in Blockbench and put it in kubejs/assets/kubejs/models/item/test_item.json
  event.create('raw_bauxite_ore')
    .displayName('Raw Bauxite Ore')
    .texture('neo:metal_raw_aluminum')
})