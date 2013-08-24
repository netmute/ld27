ig.module(
  'game.entities.talk'
)
.requires(
  'plusplus.entities.conversation'
  'plusplus.core.config'
  'plusplus.helpers.utils'
)
.defines ->

  _c = ig.CONFIG
  _ut = ig.utils

  ig.EntityTalk = ig.global.EntityTalk = ig.EntityConversation.extend

    initProperties: ->
      @parent()
      @addStep "Hello Bob.", "player"
      @addStep "Hello Player.", "bob"
      @addStep "Nice weather today, huh?", "player"
      @addStep "We're on a spaceship, moron.", "bob"
