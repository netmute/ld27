ig.module(
  'game.main'
)
.requires(
  'plusplus.core.plusplus'
  'game.levels.ship'
  'game.entities.star'
  # 'plusplus.debug.debug'
)
.defines ->

  _c = ig.CONFIG

  game = ig.GameExtended.extend

    init: ->
      @parent()
      @loadLevel ig.global.LevelShip

    inputStart: ->
      @parent()
      ig.input.bind ig.KEY.P, 'pause'

    inputEnd: ->
      @parent()
      ig.input.unbind ig.KEY.P, 'pause'

    respondInput: ->
      @parent()
      if ig.input.pressed 'pause'
        if @paused
          @unpause()
        else
          @pause()

    update: ->
      @parent()
      @particleTimer = @particleTimer || new ig.Timer .5
      if @particleTimer.delta() > 0
        @spawnEntity ig.global.EntityStar, ig.system.width, Math.random() * ig.system.height
        @particleTimer.reset()

  ig.main '#canvas', game, 60, _c.GAME_WIDTH, _c.GAME_HEIGHT, _c.SCALE, ig.LoaderExtended
