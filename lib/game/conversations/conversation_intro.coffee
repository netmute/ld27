ig.module(
  'game.conversations.conversation_intro'
)
.requires(
  'plusplus.entities.conversation'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityConversation_intro = ig.global.EntityConversation_intro = ig.EntityConversation.extend

    pausing: yes

    initProperties: ->
      @parent()
      @addStep "So, this is the engine room.", "captain"
      @addStep "This will be your workplace for the next 1.863 miles.", "captain"
      @addStep "Which is not that long.", "captain"
      @addStep "Actually, our light engine should cover the distance in about 10 seconds.", "captain"
      @addStep "Whoa.", "player"
      @addStep "Yeah. Try to not break anything important.", "captain"
      @addStep "I'll be on the bridge then.", "captain"

    deactivate: ->
      captain = ig.game.getEntityByName('captain')
      captain.moveTo x: 230, y: 81
      captain.moveToRight()
      @parent()
