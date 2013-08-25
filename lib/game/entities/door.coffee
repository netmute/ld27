ig.module(
  'game.entities.door'
)
.requires(
  'plusplus.abstractities.door'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityDoor = ig.global.EntityDoor = ig.Door.extend

    size:
      x: 12
      y: 48

    offset:
      x: -4
      y: 0

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'door.png', 4, 48

    animSettings:
      idleX:
        frameTime: 1
        sequence: [0]
      openX:
        frameTime: .025
        sequence: [1,2,3,4,5,6]
      closeX:
        frameTime: .025
        sequence: [5,4,3,2,1,0]
