ig.module(
  'game.conversations.conversation_bridge'
)
.requires(
  'plusplus.entities.conversation'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityConversation_bridge = ig.global.EntityConversation_bridge = ig.EntityConversation.extend

    pausing: yes

    initProperties: ->
      @parent()
      @addStep "There is nothing do to in here.", "player"
      @addStep "Yeah. He will build the Ludumia in 48 hours, he said.", "captain"
      @addStep "Everything will be fine, he said.", "captain"
      @addStep "Guess what? He fucked up.", "captain"
      @addStep "Who's this mysterious 'he'?", "player"
      @addStep "The DEVELOPER.", "captain"
      @addStep "What a moron.", "player"
      @addStep "Guess I'll just enjoy the view then.", "player"

    activate: ->
      captain = ig.game.getEntityByName('captain')
      captain.moveToLeft()
      @parent()
