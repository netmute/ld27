ig.module(
  'game.conversations.conversation_start'
)
.requires(
  'plusplus.entities.conversation'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityConversation_start = ig.global.EntityConversation_start = ig.EntityConversation.extend

    pausing: yes

    initProperties: ->
      @parent()
      @addStep "Hi. I'm Ple Jer.", "player"
      @addStep "I'm looking for the captain of the Ludumia.", "player"
      @addStep "That would be me. I'm Kep Tein, the captain of this ship.", "captain"
      @addStep "I'm your new mechanic.", "player"
      @addStep "I see. Your first time on a starship, eh?", "captain"
      @addStep "Yes, sir.", "player"
      @addStep "Stop the 'sir'.", "captain"
      @addStep "You can keep your stuff in the crew quarters, ladder down, on the right.", "captain"
      @addStep "Meet me in the engine room when you have settled in.", "captain"
      @addStep "Aye, sir.", "player"
      @addStep "*sigh*", "captain"

    deactivate: ->
      ig.game.getEntityByName('captain').moveTo x: 200, y: 237
      @parent()
