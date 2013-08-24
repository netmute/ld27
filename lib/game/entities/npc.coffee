ig.module(
  'game.entities.npc'
)
.requires(
  'plusplus.abstractities.character'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityNpc = ig.global.EntityNpc = ig.Character.extend

    name: "bob"

    size:
      x: 9
      y: 34

    animSheet: new ig.AnimationSheet _c.PATH_TO_MEDIA + 'player.png', 9, 34

    animSettings: idleX:
      frameTime: 1
      sequence: [0]

    ready: ->
      @parent()
      @moveToLeft()
