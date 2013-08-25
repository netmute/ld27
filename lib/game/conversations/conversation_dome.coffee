ig.module(
  'game.conversations.conversation_dome'
)
.requires(
  'plusplus.entities.conversation'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityConversation_dome = ig.global.EntityConversation_dome = ig.EntityConversation.extend

    pausing: yes

    initProperties: ->
      @parent()
      @addStep "Whoa. What a view.", "player"
      @addStep "I have always dreamed about this.", "player"

    activate: ->
      player = ig.game.getEntityByName('player')
      player.moveToRight()
      player.moveToStop()
      @parent()
