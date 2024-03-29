// Generated by CoffeeScript 1.6.3
(function() {
  ig.module('game.conversations.conversation_start').requires('plusplus.entities.conversation', 'plusplus.core.config', 'plusplus.helpers.utils').defines(function() {
    var _c, _ut;
    _c = ig.CONFIG;
    _ut = ig.utils;
    return ig.EntityConversation_start = ig.global.EntityConversation_start = ig.EntityConversation.extend({
      pausing: true,
      initProperties: function() {
        this.parent();
        this.addStep("Hi. I'm Ple Jer.", "player");
        this.addStep("I'm looking for the captain of the Ludumia.", "player");
        this.addStep("That would be me. I'm Kep Tein, the captain of this ship.", "captain");
        this.addStep("I'm your new mechanic.", "player");
        this.addStep("I see. Your first time on a starship, eh?", "captain");
        this.addStep("Yes, sir.", "player");
        this.addStep("Stop the 'sir'.", "captain");
        this.addStep("You can keep your stuff in the crew quarters, ladder down, on the right.", "captain");
        this.addStep("Meet me in the engine room when you have settled in.", "captain");
        this.addStep("Aye, sir.", "player");
        return this.addStep("*sigh*", "captain");
      },
      deactivate: function() {
        ig.game.getEntityByName('captain').moveTo({
          x: 200,
          y: 237
        });
        return this.parent();
      }
    });
  });

}).call(this);

/*
//@ sourceMappingURL=conversation_start.map
*/
