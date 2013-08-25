// Generated by CoffeeScript 1.6.3
(function() {
  ig.module('game.entities.exhaust').requires('plusplus.abstractities.player', 'plusplus.core.config', 'plusplus.helpers.utils').defines(function() {
    var _c, _ut;
    _c = ig.CONFIG;
    _ut = ig.utils;
    return ig.EntityExhaust = ig.global.EntityExhaust = ig.EntityExtended.extend({
      size: {
        x: 40,
        y: 40
      },
      animSheet: new ig.AnimationSheet(_c.PATH_TO_MEDIA + 'exhaust.png', 40, 40),
      animSettings: {
        idleX: {
          frameTime: 1,
          sequence: [0]
        }
      },
      update: function() {
        if (this.currentAnim) {
          this.currentAnim.alpha = Math.sin(new Date().getTime()).map(-1, 1, .4, .8);
        }
        return this.parent();
      }
    });
  });

}).call(this);

/*
//@ sourceMappingURL=exhaust.map
*/