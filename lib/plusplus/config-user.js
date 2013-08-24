ig.module(
        'plusplus.config-user'
    )
    .defines(function () {

        /**
         * User configuration of Impact++.
         * <span class="alert alert-info"><strong>Tip:</strong> it is recommended to modify this configuration file!</span>
         * @example
         * // in order to add your own custom configuration to Impact++
         * // edit the file defining ig.CONFIG_USER, 'plusplus/config-user.js'
         * // ig.CONFIG_USER is never modified by Impact++ (it is strictly for your use)
         * // ig.CONFIG_USER is automatically merged over Impact++'s config
         * @static
         * @readonly
         * @memberof ig
         * @namespace ig.CONFIG_USER
         * @author Collin Hover - collinhover.com
         **/
        ig.CONFIG_USER = {};

        ig.CONFIG_USER.LOADER_LOGO_SRC_MAIN = "";
        ig.CONFIG_USER.LOADER_LOGO_SRC_ALT = "";

        ig.CONFIG_USER.GAME_HEIGHT_PCT = 1;
        ig.CONFIG_USER.GAME_WIDTH_PCT = 1;
        ig.CONFIG_USER.SCALE = 3;

        ig.CONFIG_USER.FONT = {};
        ig.CONFIG_USER.FONT.MAIN_NAME = "font_04b03_black_8.png";

        ig.CONFIG_USER.TEXT_BUBBLE = {};
        ig.CONFIG_USER.TEXT_BUBBLE.R = 1;
        ig.CONFIG_USER.TEXT_BUBBLE.G = 1;
        ig.CONFIG_USER.TEXT_BUBBLE.B = 1;
        ig.CONFIG_USER.TEXT_BUBBLE.ALPHA = 0.9;

        // ig.CONFIG_USER.PRERENDER_MAPS = false;
        ig.CONFIG_USER.PRERENDER_BACKGROUND_LAYER = false;

    });
