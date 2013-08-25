ig.module(
  'game.entities.star'
)
.requires(
  'plusplus.entities.particle-color'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityStar = ig.global.EntityStar = ig.EntityParticleColor.extend

    size:
      x: 1
      y: 1

    collides: ig.EntityExtended.COLLIDES.NEVER

    gravityFactor: 0
    animTileOffset: 28
    lifeDuration: 5
    randomDoubleVel: no
    randomVel: no

    initProperties: ->
      @parent()
      @vel = x: -100, y: 0
