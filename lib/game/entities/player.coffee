ig.module(
  'game.entities.player'
)
.requires(
  'plusplus.abstractities.player'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityPlayer = ig.global.EntityPlayer = ig.Player.extend

    size:
      x: 9
      y: 34

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'player.png', 9, 34

    animSettings: idleX:
      frameTime: 1
      sequence: [0]
