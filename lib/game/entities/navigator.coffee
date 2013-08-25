ig.module(
  'game.entities.navigator'
)
.requires(
  'plusplus.abstractities.character'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityNavigator = ig.global.EntityNavigator = ig.Character.extend

    name: "navigator"

    size:
      x: 9
      y: 34

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'navigator.png', 9, 34

    animSettings: idleX:
      frameTime: 1
      sequence: [0]
