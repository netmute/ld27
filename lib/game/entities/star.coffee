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

    lifeDuration: 4
    gravityFactor: 0
    friction: 0
    animTileOffset: 28
    randomDoubleVel: no
    randomVel: no

    initProperties: ->
      @parent()
      @vel = x: -200, y: 0

    updateDynamics: ->
      @vel.y += ig.game.gravity * ig.system.tick * @gravityFactor
      @updateVelocity()
      vx = @vel.x * ig.system.tick
      vy = @vel.y * ig.system.tick

      @handleMovementTrace {
        collision: x: false, y: false, slope: false
        pos: x: @pos.x + vx, y: @pos.y + vy
        tile: x: 0, y: 0
      }
