ig.module(
  'game.entities.ladderdoor'
)
.requires(
  'plusplus.abstractities.door'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityLadderdoor = ig.global.EntityLadderdoor = ig.Door.extend

    size:
      x: 16
      y: 8

    offset:
      x: 0
      y: -2

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'ladderdoor.png', 16, 4

    animSettings:
      idleX:
        frameTime: 1
        sequence: [0]
      openX:
        frameTime: .025
        sequence: [1,2,3,4]
      closeX:
        frameTime: .025
        sequence: [4,3,2,1,0]
