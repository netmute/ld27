ig.module(
  'game.conversations.conversation_bed'
)
.requires(
  'plusplus.entities.conversation'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityConversation_bed = ig.global.EntityConversation_bed = ig.EntityConversation.extend

    pausing: yes

    initProperties: ->
      @parent()
      @addStep "Which one is my mine? They all look unused.", "player"
      @addStep "I'll just take this one.", "player"

    deactivate: ->
      @parent()
