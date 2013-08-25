ig.module(
  'game.entities.exhaust'
)
.requires(
  'plusplus.abstractities.player'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityExhaust = ig.global.EntityExhaust = ig.EntityExtended.extend

    size:
      x: 40
      y: 40

    # gravityFactor: 0
    # performance: _c.DYNAMIC

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'exhaust.png', 40, 40

    animSettings:
      idleX:
        frameTime: 1
        sequence: [0]

    update: ->
      if @currentAnim
        @currentAnim.alpha = Math.sin( new Date().getTime() ).map(-1, 1, .4, .8)
      @parent()
