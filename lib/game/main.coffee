ig.module(
  'game.main'
)
.requires(
  'plusplus.core.plusplus'
  'game.levels.ship'
  # 'plusplus.debug.debug'
)
.defines ->

  _c = ig.CONFIG

  game = ig.GameExtended.extend

    init: ->
      @parent()
      @loadLevel ig.global.LevelShip

  ig.main '#canvas', game, 60, _c.GAME_WIDTH, _c.GAME_HEIGHT, _c.SCALE, ig.LoaderExtended
