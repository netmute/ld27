ig.module(
  'game.entities.captain'
)
.requires(
  'plusplus.abstractities.character'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityCaptain = ig.global.EntityCaptain = ig.Character.extend

    name: "captain"

    size:
      x: 9
      y: 34

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'captain.png', 9, 34

    animSettings: idleX:
      frameTime: 1
      sequence: [0]

    ready: ->
      @parent()
      @moveToLeft()
