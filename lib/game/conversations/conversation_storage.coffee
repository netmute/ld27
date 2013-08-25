ig.module(
  'game.conversations.conversation_storage'
)
.requires(
  'plusplus.entities.conversation'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityConversation_storage = ig.global.EntityConversation_storage = ig.EntityConversation.extend

    pausing: yes

    initProperties: ->
      @parent()
      @addStep "Oh, sorry. Didn't know there was someone in here.", "player"
      @addStep "Nevermind. You can help me looking through this stuff.", "navigator"
      @addStep "You are... a little girl?", "player"
      @addStep "And the best navigator on this side of the galaxy.", "navigator"
      @addStep "I thought, after that captain, nothing could surprise you anymore.", "navigator"
      @addStep "Thinks he's fucking Picard or somethin'.", "navigator"
      @addStep "What exactly are you looking for?", "player"
      @addStep "Navigation equipment. The captain has 'stored' it somewhere 'round here.", "navigator"
      @addStep "We ain't going anywhere without it.", "navigator"

    activate: ->
      ig.game.getEntityByName('navigator').moveToLeft()
      @parent()

    deactivate: ->
      ig.game.getEntityByName('navigator').moveToRight()
      @parent()
