ig.module(
  'game.entities.docking'
)
.requires(
  'plusplus.abstractities.player'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityDocking = ig.global.EntityDocking = ig.EntityExtended.extend

    size:
      x: 336
      y: 48

    gravityFactor: 0
    performance: _c.DYNAMIC

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'docking.png', 336, 48

    animSettings:
      idleX:
        frameTime: 1
        sequence: [0]

    canFlipX: no

    initProperties: ->
      @vel = x: -50, y: 0
      @killTimer = new ig.Timer 6
      @parent()

    update: ->
      @parent()
      if @killTimer.delta() > 0
        @kill()
