ig.module(
        'plusplus.core.entity'
    )
    .requires(
        'impact.entity',
        'plusplus.core.config',
        'plusplus.core.timer',
		'plusplus.core.image',
        'plusplus.core.background-map',
        'plusplus.core.animation',
        'plusplus.helpers.signals',
        'plusplus.helpers.tweens',
        'plusplus.helpers.utils',
        'plusplus.helpers.utilsmath',
        'plusplus.helpers.utilsvector2',
        'plusplus.helpers.utilsintersection',
        'plusplus.helpers.utilsdraw',
        'plusplus.helpers.utilscolor',
        'plusplus.helpers.utilstile'
    )
    .defines(function () {
        "use strict";

        var _c = ig.CONFIG;
        var _tw = ig.TWEEN;
        var _ut = ig.utils;
        var _utm = ig.utilsmath;
        var _utv2 = ig.utilsvector2;
        var _uti = ig.utilsintersection;
        var _utd = ig.utilsdraw;
        var _utc = ig.utilscolor;
        var _utt = ig.utilstile;

        /**
         * Enhanced entity that is the core of Impact++.
         * <br>- entity animations can be added dynamically and handle inheritance far more flexibly with {@link ig.EntityExtended#animSettings}
         * <br>- entities update is now opt-in using {@link ig.EntityExtended#performance} and {@link ig.EntityExtended#frozen}
         * <br>- added {@link ig.EntityExtended#bounds} and {@link ig.EntityExtended#boundsDraw} to speed up searches and allow entities be more flexible
         * <span class="alert alert-info"><strong>Tip:</strong> your entities should be a descendant of this to utilize Impact++ properly.</span>
         * @class
         * @extends ig.Entity
         * @author Collin Hover - collinhover.com
         **/
        ig.EntityExtended = ig.Entity.extend(/**@lends ig.EntityExtended.prototype */{

            /**
             * Layer to be added to upon instantiation.
             * @type String
             * @default
             */
            layerName: 'entities',

            /**
             * Base position.
             * @type Vector2|Object
             */
            pos: _utv2.vector(),

            /**
             * Size of entity
             * @type Vector2|Object
             * @see ig.CONFIG.ENTITY.SIZE_EFFECTIVE_X
             * @see ig.CONFIG.ENTITY.SIZE_EFFECTIVE_Y
             */
            size: _utv2.vector( _c.ENTITY.SIZE_EFFECTIVE_X, _c.ENTITY.SIZE_EFFECTIVE_Y ),

            /**
             * Offset of entity, reflected on both sides.
             * @type Vector2|Object
             * @see ig.CONFIG.ENTITY.SIZE_OFFSET_X
             * @see ig.CONFIG.ENTITY.SIZE_OFFSET_Y
             */
            offset: _utv2.vector( _c.ENTITY.SIZE_OFFSET_X, _c.ENTITY.SIZE_OFFSET_Y ),

            /**
             * Drawn position.
             * @type Vector2|Object
             * @readonly
             */
            posDraw: _utv2.vector(),

            /**
             * Drawn size of entity, including size, offsets, etc.
             * @type Vector2|Object
             * @readonly
             */
            sizeDraw: _utv2.vector(),

            /**
             * Scale that overrides system scale when {@link ig.EntityExtended#ignoreSystemScale} is true.
             * @type Number
             * @default ig.CONFIG.ENTITY.SCALE
             */
            scale: _c.ENTITY.SCALE,

            /**
             * Modifier for when {@link ig.EntityExtended#scale} != {@link ig.system.scale}.
             * @type Number
             * @default
			 * @readonly
             */
            scaleMod: 1,

            /**
             * Whether entity elements should ignore system scale.
             * @type Boolean
             * @default ig.CONFIG.ENTITY.IGNORE_SYSTEM_SCALE
             */
            ignoreSystemScale: _c.ENTITY.IGNORE_SYSTEM_SCALE,

            /**
             * How entity should collide with other entities.
             * <br>- this does not affect whether entity collides with collision map, only how it collides with other entities
             * <span class="alert"><strong>IMPORTANT:</strong> for an entity to avoid being ignored in checks, it must either collide, checkAgainst, or have a type!</span>
             * @type Bitflag
             * @default never
             * @see ig.Entity
             */
            collides: 0,

            /**
             * Entities to check against, expanded for more flexibility and specificity.
             * <span class="alert"><strong>IMPORTANT:</strong> for an entity to avoid being ignored in checks, it must either collide, checkAgainst, or have a type!</span>
             * @type Bitflag
             * @default none
             * @see ig.utils.getType
             */
            checkAgainst: 0,

            /**
             * Entity type, expanded for more flexibility and specificity.
             * <span class="alert"><strong>IMPORTANT:</strong> for an entity to avoid being ignored in checks, it must either collide, checkAgainst, or have a type!</span>
             * @type Bitflag
             * @default none
             * @see ig.utils.getType
             */
            type: 0,

            /**
             * Group of entities to avoid checking against and colliding with.
             * <span class="alert alert-info"><strong>Tip:</strong> as the group property is a bitflag, it can be any combination of groups!</span>
             * @type Bitflag
             * @default none
             * @see ig.utils.getType
             */
            group: 0,

            /**
             * Whether entity should skip updating.
             * @type Boolean
             * @default
             */
            frozen: false,

            /**
             * Whether entity has control of itself.
             * <span class="alert"><strong>IMPORTANT:</strong> uncontrollable entities update but do not move or change!</span>
             * @type Boolean
             * @default
             */
            controllable: true,

            /**
             * How entity should perform during update.
             * <br>- static will only update animation
             * <br>- movable can move but does not collide with collision map
             * <br>- dynamic does full update, including movement and collision map checks
             * <span class="alert"><strong>IMPORTANT:</strong> this directly correlates to the complexity of entity's update and whether it collides with collision map.</span>
             * @type String
             * @default static
             */
            performance: _c.STATIC,

            /**
             * Whether is fixed in screen vs inside world space.
             * <br>- this is particularly useful for UI elements
             * <span class="alert"><strong>IMPORTANT:</strong> fixed elements cannot have dynamic performance!</span>
             * @type Boolean
             * @default
             */
            fixed: false,

            /**
             * Facing direction of entity based on velocity and look at.
             * @type Vector2|Object
			 * @default right
             */
            facing: _utv2.vector( 1, 0 ),

            /**
             * Whether entity can flip animations vertically and set facing on x.
             * @type Boolean
			 * @default
             */
            canFlipX: _c.ENTITY.CAN_FLIP_X,

             /**
             * Whether entity can flip animations vertically and set facing on y.
             * @type Boolean
			 * @default
             */
            canFlipY: _c.ENTITY.CAN_FLIP_Y,

            /**
             * Friction of entity
             * @type Vector2|Object
             * @see ig.CONFIG.ENTITY.FRICTION_X
             * @see ig.CONFIG.ENTITY.FRICTION_Y
             */
            friction: _utv2.vector( _c.ENTITY.FRICTION_X, _c.ENTITY.FRICTION_Y ),

            /**
             * Max velocity of entity
             * @type Vector2|Object
             * @see ig.CONFIG.ENTITY.MAX_VEL_X
             * @see ig.CONFIG.ENTITY.MAX_VEL_Y
             */
            maxVel: _utv2.vector( _c.ENTITY.MAX_VEL_X, _c.ENTITY.MAX_VEL_Y ),

            /**
             * Angle of rotation in radians.
             * @type Number
             * @default
             */
            angle: 0,

            /**
             * How bouncy entity is in collisions, between 0 and 1.
             * @type Number
             * @see ig.CONFIG.ENTITY.BOUNCINESS
             */
            bounciness: _c.ENTITY.BOUNCINESS,

            /**
             * Minimum velocity to bounce.
             * @type Number
             * @see ig.CONFIG.ENTITY.MIN_BOUNCE_VEL
             */
            minBounceVelocity: _c.ENTITY.MIN_BOUNCE_VEL,

            /**
             * Currently displaying animation.
             * <br>- defers to {@link ig.EntityExtended#overridingAnim}
             * @type ig.AnimationExtended
             * @default
             * @readonly
             */
            currentAnim: null,

            /**
             * Currently overriding animation.
             * <br>- if present, this displays instead of {@link ig.EntityExtended#currentAnim}
             * @type ig.AnimationExtended
             * @default
             * @readonly
             */
            overridingAnim: null,

            /**
             * Path to dynamic animation sheet.
             * <br>- created on init
             * <br>- automatically prepends shared base media directory from {@link ig.CONFIG.PATH_TO_MEDIA}
             * <span class="alert"><strong>IMPORTANT:</strong> use this for dynamically / run-time created entity types, not classes.</span>
             * @type String
             * @default
             */
            animSheetPath: '',

            /**
             * Tile width of dynamic animation sheet.
             * <span class="alert"><strong>IMPORTANT:</strong> use this for dynamically / run-time created entity types, not classes.</span>
             * @type Number
             * @default
             */
            animSheetWidth: 0,

            /**
             * Tile height of dynamic animation sheet.
             * <span class="alert"><strong>IMPORTANT:</strong> use this for dynamically / run-time created entity types, not classes.</span>
             * @type Number
             * @default
             */
            animSheetHeight: 0,

            /**
             * Animation settings used to automatically create and add animations on initialization.
             * <br>- use this instead of hardcoding animations into {@link ig.EntityExtended#init} for better inheritance!
             * @type Object
             * @default
             * @example
             * // previous method of adding animations
             * // this would likely be hardcoded into the init method
             * this.addAnim( 'idleX', 0.25, [0,1] );
             * // new (and improved?) method of adding animations
             * // which would be defined in the class properties
             * // properties match the parameters passed to {@link ig.AnimationExtended#init}
             * animSettings: {
			 *		 // note here the directional animation name
			 * 	// animations in Impact++ are directional and based on flip and facing
			 * 	// so if an entity can flip X
			 * 	// you should have animations for X
			 * 	// i.e. "idleX"
			 * 	// but if an entity can flip X and Y
			 * 	// you should have animations for both X and Y
			 * 	// i.e. "idleX" and "idleY"
			 * 	// if an entity cannot flip X and Y
			 * 	// you should have animations for Up, Down, Left, and Right
			 * 	// i.e. "idleUp", "idleDown", "idleLeft", "idleRight"
             *      idleX: {
             *          // sequence frames 0 and 1
             *          sequence: [0,1],
             *          // quarter second per frame
             *          frameTime: 0.25,
             *          // play only once
             *          once: true,
             *          // do not play immediately
             *          stop: true
             *          // play animation in reverse
             *          reverse: true
             *      }
             * }
             * // then to easily change the sequence in a descendant class
             * // while retaining the original properties
             * animSettings: {
             *      idleX: {
             *          sequence: [3,4,5,6]
             *      }
             * }
             */
            animSettings: null,

            /**
             * Type of animation from {@link ig.EntityExtended#animationTypes}.
             * <br>- used when creating animations from {@link ig.EntityExtended#animSettings}
             * @type Number
             * @default
             */
            animationType: 0,

            /**
             * Types of animation.
             * <br>- used when creating animations from {@link ig.EntityExtended#animSettings}
             * @type Array
             * @default
             */
            animationTypes: null,

            /**
             * Default sequence frame count for animations when not defined in {@link ig.EntityExtended#animSettings}.
             * <br>- used when creating animations from {@link ig.EntityExtended#animSettings}
             * @type Number
             * @default
             */
            animSequenceCount: 1,

            /**
             * Default tile offset, within animation sheet, to start animation when not defined in {@link ig.EntityExtended#animSettings}.
             * <br>- used when creating animations from {@link ig.EntityExtended#animSettings}
             * @type Number
             * @default
             */
            animTileOffset: 0,

            /**
             * Default frame time in seconds for animations when not defined in {@link ig.EntityExtended#animSettings}.
             * <br>- used when creating animations from {@link ig.EntityExtended#animSettings}
             * @type Number
             * @default
             */
            animFrameTime: 1,

            /**
             * Name of animation to play when entity is ready and after spawned.
             * @type String
             * @default
             */
            animInit: '',

            /**
             * Whether animations should be automatically textured across entity when added to entity.
             * <br>- textures can be animated, but be careful about adding high amounts of frames
             * <span class="alert alert-info"><strong>Tip:</strong> this is best applied to resizable entities.</span>
             * @type Boolean
             * @default
             */
            textured: false,

            /**
             * Whether entity should remain across levels.
             * <span class="alert alert-info"><strong>Tip:</strong> an entity will only be moved from one level to another if an entity is found with a matching name!</span>
             * <span class="alert"><strong>IMPORTANT:</strong> the game will keep the first of each uniquely named persistent entity it encounters and merge the editor position and settings of any others with the same name as it encounters them.</span>
             * @type Boolean
             * @default
             */
            persistent: false,

            /**
             * Whether entity can be targeted by an intersection search.
             * <span class="alert alert-info"><strong>Tip:</strong> for interactive entities, set this to true and add the {@link ig.EntityExtended.TYPE.INTERACTIVE} flag to its type.</span>
             * @type Boolean
             * @default
             */
            targetable: false,

            /**
             * Whether entity is climbable.
             * @type Boolean
             * @default
             */
            climbable: false,

            /**
             * Whether entity is climbable as stairs.
             * <span class="alert"><strong>IMPORTANT:</strong> has no effect unless {@link ig.EntityExtended#climbable} is true.</span>
             * @type Boolean
             * @default
             */
            climbableStairs: false,

            /**
             * Whether entity is one way
             * @type Boolean
             * @default
             */
            oneWay: false,

            /**
             * Direction from which entity will collide with another entity.
             * @type Vector2
             * @default
             * @example
             * // direction should be a 2d vector with a length of 1
             * // i.e. this is invalid
             * entity.oneWayFacing = { x: 0, y: 0 };
             * // while either of the following is okay
             * entity.oneWayFacing = { x: 1, y: 0 };
             * entity.oneWayFacing = ig.utilsvector2.vector( 1, 0 );
             * // to block from the left
             * entity.oneWayFacing = { x: -1, y: 0 };
             * // to block from the right
             * entity.oneWayFacing = { x: 1, y: 0 };
             * // to block from the top
             * entity.oneWayFacing = { x: 0, y: -1 };
             * // to block from the bottom
             * entity.oneWayFacing = { x: 0, y: 1 };
             */
            oneWayFacing: null,

            /**
             * Whether entity casts a shadow from lights.
             * @type Boolean
             * @default
             */
            opaque: _c.ENTITY.OPAQUE,

            /**
             * Size to offset from entity bounds for casting shadows when {@link ig.EntityExtended#opaque}.
             * <span class="alert alert-info"><strong>Tip:</strong> to set opaque offsets per animation, use {@link ig.AnimationExtended#opaqueOffset}</span>
             * @type Object
             * @see ig.CONFIG.ENTITY.OPAQUE_OFFSET
             * @example
             * // by default, shadow casting uses
             * // entity's opaque offsets
             * entity.opaqueOffset = {
             *      left: 0,
             *      right: 0,
             *      top: 0,
             *      bottom: 0
             * };
             * // unless the entity's current animation
             * // has its own opaque offsets
             * entity.currentAnim.opaqueOffset = {
             *      left: 0,
             *      right: 0,
             *      top: 0,
             *      bottom: 0
             * };
             * // opaque offsets can also be done per tile
             * entity.currentAnim.opaqueOffset = {
             *      tiles: {
              *         1: {
             *              left: 0,
             *              right: 0,
             *              top: 0,
             *              bottom: 0
             *          },
             *          2: {...}
             *      }
             * };
             */
            opaqueOffset: _c.ENTITY.OPAQUE_OFFSET,

            /**
             * List of vertices in world space for shadow casting.
             * <br>- recalculated when casting shadows by {@link ig.EntityExtended#getOpaqueVertices}
             * @type Array
             */
            opaqueVertices: null,

            /**
             * Whether opaque vertices should use vertices when present.
             * <span class="alert"><strong>IMPORTANT:</strong> when true, this overrides {@link ig.EntityExtended#initOpaqueVertices}, and {@link ig.EntityExtended#getOpaqueVertices}.
             * @type Boolean
             * @default
             * @see ig.CONFIG.ENTITY.OPAQUE_FROM_VERTICES
             */
            opaqueFromVertices: _c.ENTITY.OPAQUE_FROM_VERTICES,

            /**
             * How much light is blocked when {@link ig.EntityExtended#opaque}.
             * @type Number
             * @default
             */
            diffuse: _c.ENTITY.DIFFUSE,

            /**
             * Whether entity only casts shadows from edges when {@link ig.EntityExtended#opaque}.
             * @type Boolean
             * @default
             */
            hollow: true,

            /**
             * Whether entity's activate has been triggered,
             * <br>- set to true to have an entity activate on init
             * @type Boolean
             * @default
             */
            activated: false,

            /**
             * Whether entity's activate should override deactivate.
             * @type Boolean
             * @default
             */
            alwaysToggleActivate: false,

            /**
             * Function called on activate.
             * <br>- do not use this for predefined entity classes, override activate instead
             * @type Function
             */
            activateCallback: null,

            /**
             * Context to execute activate callback function in.
             * <br>- do not use this for predefined entity classes, override activate instead
             * @type Object
             */
            activateContext: null,

            /**
             * Function called on deactivate.
             * <br>- do not use this for predefined entity classes, override activate instead
             * @type Function
             */
            deactivateCallback: false,

            /**
             * Context to execute deactivate callback function in.
             * <br>- do not use this for predefined entity classes, override activate instead
             * @type Object
             */
            deactivateContext: false,

            /**
             * Entity alpha.
             * <span class="alert"><strong>IMPORTANT:</strong> applied to animations automatically on draw.</span>
             * @type Number
             * @default
             */
            alpha: 1,

            /**
             * Health statistic.
             * <br>- someone once asked me how I died, so I told them that my health reached 0
             * @type Number
             * @default
             */
            health: _c.ENTITY.HEALTH,

            /**
             * Max health statistic.
             * @type Number
             * @default
             */
            healthMax: _c.ENTITY.HEALTH,

            /**
             * Whether entity blocks all incoming damage.
             * @type Boolean
             * @default
             */
            invulnerable: false,

            /**
             * Horizontal range at which this entity can be interacted with.
             * <br>- a range of 0 is considered infinite
             * <br>- abilities compare this to their own range and use the higher of the two
             * <span class="alert"><strong>IMPORTANT:</strong> only relevant if entity type includes {@link ig.EntityExtended.TYPE.INTERACTIVE}.</span>
             * @type Number
             * @default
             */
            rangeInteractableX: 0,

            /**
             * Vertical range at which this entity can be interacted with.
             * <br>- a range of 0 is considered infinite
             * <br>- abilities compare this to their own range and use the higher of the two
             * <span class="alert"><strong>IMPORTANT:</strong> only relevant if entity type includes {@link ig.EntityExtended.TYPE.INTERACTIVE}.</span>
             * @type Number
             * @default
             */
            rangeInteractableY: 0,

            /**
             * Whether entity is paused.
             * @type Boolean
             * @default
             * @readonly
             */
            paused: false,

            /**
             * Whether entity is visible in screen.
             * @type Boolean
             * @default
             * @readonly
             */
            visible: false,

            /**
             * Whether entity has changed since last update.
             * @type Boolean
             * @default
             * @readonly
             */
            changed: false,

            /**
             * Whether entity is checking against another entity matching {@link ig.Entity#checkAgainst} flag.
             * @type Boolean
             * @default
             * @readonly
             */
            checking: false,

            /**
             * Whether entity has been added to game world.
             * @type Boolean
             * @default
             * @readonly
             */
            added: false,

            /**
             * Whether entity is in the process of dieing.
             * @type Boolean
             * @default
             * @readonly
             */
            dieing: false,

            /**
             * Whether entity is in the process of dieing without effects or animation.
             * @type Boolean
             * @default
             * @readonly
             */
            dieingSilently: false,

            /**
             * Whether entity is flipped.
			 * <span class="alert"><strong>IMPORTANT:</strong> flip is now an object with x and y boolean values!</span>
             * @type Boolean
             * @default
             */
            flip: {
                x: false,
                y: false
            },

            /**
             * Whether entity is grounded.
             * @type Boolean
			 * @see ig.CONFIG.TOP_DOWN
             */
            grounded: _c.TOP_DOWN,

            /**
             * Whether entity is standing.
			 * @type Boolean
			 * @see ig.CONFIG.TOP_DOWN
             */
            standing: _c.TOP_DOWN,

            /**
             * Percent of gravity to apply, between 0 and 1.
			 * @type Number
			 * @see ig.CONFIG.TOP_DOWN
             */
            gravityFactor: _c.TOP_DOWN ? 0 : 1,
			
			/**
			 * Whether entity is colliding with a wall, floor, ceiling, etc in collision map.
			 * @type Boolean
			 * @default false
			 */
			collidingWithMap: false,

            /**
             * Whether entity is on a slope, and if so, slope properties.
             * @type Boolean|Object
             */
            slope: false,

            /**
             * Speed multiplier on slopes
             * @type Number
             * @see ig.CONFIG.ENTITY.SLOPE_SPEED_MOD
             */
            slopeSpeedMod: _c.ENTITY.SLOPE_SPEED_MOD,

            /**
             * Slope angle range that entity can stand on.
             * @type Vector2
             * @see ig.CONFIG.ENTITY.SLOPE_STANDING_MIN
             * @see ig.CONFIG.ENTITY.SLOPE_STANDING_MAX
             */
            slopeStanding: {min: (_c.ENTITY.SLOPE_STANDING_MIN).toRad(), max: (_c.ENTITY.SLOPE_STANDING_MAX).toRad() },

            /**
             * Whether entity is moving.
             * @type Boolean
             * @default
             * @readonly
             */
            moving: false,

            /**
             * Whether entity is moving horizontally.
             * @type Boolean
             * @default
             * @readonly
             */
            movingX: false,

            /**
             * Whether entity is moving vertically.
             * @type Boolean
             * @default
             * @readonly
             */
            movingY: false,

            /**
             * Whether entity is moving to another entity.
             * @type ig.EntityExtended|Vector2|Object
             * @default
             * @readonly
             */
            movingTo: null,

            /**
             * Whether entity has moved to currently moving to entity.
             * @type Boolean
             * @default
             * @readonly
             */
            movedTo: true,

            /**
             * Whether entity should move to another entity and stop moving.
             * @type Boolean
             * @default
             * @readonly
             */
            movingToOnce: false,

            /**
             * Whether entity is tweening to another entity.
             * <span class="alert"><strong>IMPORTANT:</strong> this is automatically disabled with dynamic entities!</span>
             * @type Boolean
             * @default
             * @readonly
             */
            movingToTweening: false,

            /**
             * Percent progress of tweening to another entity.
             * @type Number
             * @readonly
             */
            movingToTweenPct: 0,

            /**
             * Another entity that this entity is linked to.
             * @type ig.EntityExtended
             * @default
             */
            linkedTo: null,

            /**
             * All tweens affecting this entity that were initiated by {@link ig.EntityExtended#tween}.
             * <br>- these tweens are automatically deleted when complete
             * @type Object
             * @readonly
             */
            tweens: {},

            /**
             * Last recorded state taken during {@link ig.EntityExtended#recordResetState}.
             * <br>- automatically updated first time entity added to game world
             * <br>- reset state records only a limited set of properties
             * <br>- this can be useful for checkpoints, respawning, etc
             * @type Object
             */
            resetState: {},

            /**
             * Whether to calculate bounds on change.
             * @type Boolean
             * @see ig.CONFIG.ENTITY.NEEDS_BOUNDS
             */
            needsBounds: _c.ENTITY.NEEDS_BOUNDS,

            /**
             * Entity bounds, not including offsets and accounting for rotation.
             * <br>- not calculated by default for performance reasons
             * <br>- {@link ig.EntityExtended#bounds} accounts for position and size
             * <br>- {@link ig.EntityExtended#boundsDraw} accounts for position, size, offsets, and rotation
             * @property {Number} minX min x value.
             * @property {Number} maxX max x value.
             * @property {Number} minY min y value.
             * @property {Number} maxY max y value.
             * @property {Number} width width.
             * @property {Number} height height.
             * @type Object
			 * @default
             * @see ig.utilsintersection.bounds
             */
            bounds: null,

            /**
             * Entity bounds, including offsets and accounting for rotation.
             * <br>- not calculated by default for performance reasons
             * <br>- {@link ig.EntityExtended#bounds} accounts for position and size
             * <br>- {@link ig.EntityExtended#boundsDraw} accounts for position, size, offsets, and rotation
             * @property {Number} minX min x value.
             * @property {Number} maxX max x value.
             * @property {Number} minY min y value.
             * @property {Number} maxY max y value.
             * @property {Number} width width.
             * @property {Number} height height.
             * @type Object
			 * @default
             * @see ig.utilsintersection.bounds
             */
            boundsDraw: null,

            /**
             * Whether to calculate vertices on change.
             * @type Boolean
             * @see ig.CONFIG.ENTITY.NEEDS_VERTICES
             */
            needsVertices: _c.ENTITY.NEEDS_VERTICES,

            /**
             * List of vertices based on bounds, relative to entity.
             * <br>- not calculated by default for performance reasons
             * <br>- to manually enable, use {@link ig.EntityExtended#needsVertices}
             * @type Array
             */
            vertices: null,

            /**
             * List of vertices based on bounds, relative to world space.
             * <br>- not calculated by default for performance reasons
             * <br>- to manually enable, use {@link ig.EntityExtended#needsVertices}
             * @type Array
             */
            verticesWorld: null,

            /**
             * Signal dispatched when entity added to game.
             * <br>- created on init.
             * @type ig.Signal
             */
            onAdded: null,

            /**
             * Signal dispatched when entity removed from game.
             * <br>- created on init.
             * @type ig.Signal
             */
            onRemoved: null,

            /**
             * Signal dispatched when entity paused.
             * <br>- created on init.
             * @type ig.Signal
             */
            onPaused: null,

            /**
             * Signal dispatched when entity unpaused.
             * <br>- created on init.
             * @type ig.Signal
             */
            onUnpaused: null,

            /**
             * Signal dispatched when entity completes moving to another entity.
             * <br>- created on init.
             * @type ig.Signal
             */
            onMovedTo: null,

            /**
             * Signal dispatched when UI element is refreshed.
             * <br>- created on init.
             * @type ig.Signal
             */
            onRefreshed: null,

            /**
             * Whether entity needs to be rebuilt on next refresh.
             * <span class="alert alert-danger"><strong>IMPORTANT:</strong> it is usually a bad idea to set this to false initially!</span>
             * @type Boolean
             * @default
             */
            needsRebuild: true,

            // internal properties, do not modify

            _angleLast: 0,

            _stopChecking: false,

            _changedAdd: false,

            _verticesFound: false,

            _overridedAnim: false,

            /**
             * Replaces new entity with current persistent entity of same name, if exists.
             * @param {Number} x x position.
             * @param {Number} y y position.
             * @param {Object} [settings] settings object.
             * @override
             **/
            staticInstantiate: function( x, y, settings ) {

                var entity;
                var name = this.name || ( settings && settings.name );

                if ( name ) {

                    entity = ig.game.persistentEntities[ name ];

                    if ( entity ) {

                        entity.reset(x, y, settings);

                    }

                }

                return entity;

            },

            /**
             * Initializes entity.
             * <br>- initializes types for checks, via {@link ig.EntityExtended#initTypes}
             * <br>- initializes properties that are created at run-time, such as signals and timers, via {@link ig.EntityExtended#initProperties}
             * <br>- resets entity, merges in new settings, and initializes animations via {@link ig.EntityExtended#reset}
             * @param {Number} x x position.
             * @param {Number} y y position.
             * @param {Object} [settings] settings object.
             * @override
             **/
            init: function (x, y, settings) {

                this.id = ++ig.Entity._lastId;

                // types and checks

                this.initTypes();

                // properties that should only be initialized once

                this.initProperties();

                // do reset

                this.reset(x, y, settings);

            },

            /**
             * Adds this entity's types and checks.
             */
            initTypes: function () {
            },

            /**
             * Adds properties that should only be initialized once.
             */
            initProperties: function () {

                // signals

                this.onAdded = new ig.Signal();
                this.onRemoved = new ig.Signal();
                this.onPaused = new ig.Signal();
                this.onUnpaused = new ig.Signal();
                this.onMovedTo = new ig.Signal();
                this.onRefreshed = new ig.Signal();

            },

            /**
             * Resets an entity to last state.
             * @param {Number} x x position.
             * @param {Number} y y position.
             * @param {Object} [settings] settings object.
             **/
            reset: function (x, y, settings) {

                this.resetCore(x, y, settings);

                this.resetExtras();

            },

            /**
             * Resets settings and position of entity.
             * @param {Number} x x position.
             * @param {Number} y y position.
             * @param {Object} [settings] settings object.
             **/
            resetCore: function (x, y, settings) {

                // reset

                ig.merge(this, this.resetState);

                // position

                if (x) {

                    this.pos.x = x;

                }

                if (y) {

                    this.pos.y = y;

                }

                // settings
				
				if ( settings && !ig.global.wm ) {
					
					if ( typeof settings.type === 'string' ) {
						
						_ut.addType(ig.EntityExtended, this, 'type', settings.type);
						delete settings.type;
						
					}
					
					if ( typeof settings.checkAgainst === 'string' ) {
						
						_ut.addType(ig.EntityExtended, this, 'checkAgainst', settings.checkAgainst);
						delete settings.checkAgainst;
						
					}
					
					if ( typeof settings.group === 'string' ) {
						
						_ut.addType(ig.EntityExtended, this, 'group', settings.group, "GROUP");
						delete settings.group;
						
					}
					
				}

                ig.merge(this, settings);

            },

            /**
             * Resets extra properties after core.
             **/
            resetExtras: function () {

                // no longer killed, dead, or dieing

                this._killed = this.dieing = this.dieingSilently = false;

                // stats

                this.healthMax = this.health;

                // dynamic (i.e. uses physics) cannot be fixed

                if (this.performance === _c.DYNAMIC) {

                    this.fixed = false;

                }

                // fixed entities cannot collide

                if (this.fixed) {

                    this.collides = ig.EntityExtended.COLLIDES.NEVER;

                }
				
				// when there is no gravity, start grounded
				
				if ( this.gravityFactor === 0 || ig.game.gravity === 0 ) {
					
					this.standing = this.grounded = true;
					
				}

                // create anim sheet

                if (this.animSheetPath) {

                    this.animSheet = new ig.AnimationSheet(_c.PATH_TO_MEDIA + this.animSheetPath, this.animSheetWidth, this.animSheetHeight);

                    this.animSheetPath = '';

                }

                // automatically create animations

                if (this.animSettings) {
				
                    this.anims = {};
                    this.resetState.currentAnim = null;
					
					if ( this.animSettings === true ) {
						
						this.createAnim();
						
					}
					else {

						for (var animName in this.animSettings) {

							this.createAnim(animName, this.animSettings[ animName ]);

						}
						
					}
					
                    this.animSettings = false;

                }

                // update reset state

                this.recordResetState();

                // refresh

                this.refresh();

                if (this.frozen) {

                    this.changed = this._changedAdd = false;

                }
                else {

                    this.changed = this._changedAdd = true;

                }

            },

            /**
             * Records the state of an entity for later reset.
             * <br>- does not record all properties for performance reasons
             **/
            recordResetState: function () {

                this.resetState.pos = this.resetState.pos || _utv2.vector();
                _utv2.copy(this.resetState.pos, this.pos);

                this.resetState.layerName = this.layerName;
                this.resetState.frozen = this.frozen;
                this.resetState.activated = this.activated;
                this.resetState.alpha = this.alpha;

                this.resetState.type = this.type;
                this.resetState.checkAgainst = this.checkAgainst;
                this.resetState.collides = this.collides;

                this.resetState.health = this.health;

            },

            /**
             * Generates and adds an animation from {@link ig.EntityExtended#animSettings}. If no settings passed, creates default idle animation.
             * @param {Object} [name] name of animation.
             * @param {Object} [settings] settings for animation.
             * @see ig.EntityExtended#animSettings
             **/
            createAnim: function (name, settings) {

                settings = settings || {};

                var sequence = settings.sequence;

                if (!sequence || !sequence.length) {

                    sequence = settings.sequence = [];

                    var frameCount = settings.sequenceCount || this.animSequenceCount;
                    var startFrame = settings.tileOffset || this.animTileOffset;

                    // animation types are when a sprite sheet has a series of animations that are all the same length

                    var animationType = settings.type || this.animationType;

                    if (animationType && this.animationTypes) {

                        var orderIndex = _ut.indexOfValue(this.animationTypes, animationType);

                        if (orderIndex !== -1) {

                            startFrame += frameCount * orderIndex;

                        }

                    }

                    for (var j = 0; j < frameCount; j++) {

                        sequence[ j ] = startFrame + j;

                    }

                }

                settings.frameTime = settings.frameTime || this.animFrameTime;
				
				if ( name ) {
					
					this.addAnim(name, settings );
					
				}
				else {
					
					var idleAnim = this.addAnim("idle", settings );
					this.anims.idleX = idleAnim;
					this.anims.idleY = idleAnim;
					this.anims.idleLeft = idleAnim;
					this.anims.idleRight = idleAnim;
					this.anims.idleUp = idleAnim;
					this.anims.idleDown = idleAnim;
					
				}

            },

            /**
             * Adds an animation to an entity.
             * <br>- uses {@link ig.AnimationExtended} instead of the original {@link ig.Animation}
             * @param {String} name name of animation
             * @param {Object} [settings] settings based on animation properties
             * @see ig.EntityExtended#animSettings
             */
            addAnim: function (name, settings ) {

                if (!this.animSheet) {

                    throw( 'No animSheet to add the animation ' + name + ' to.' );

                }

                var animation = new ig.AnimationExtended(this.animSheet, settings );

                this.anims[name] = animation;

                if (!this.currentAnim) {

                    this.currentAnim = animation;

                }

                return animation;

            },
			
			/**
			 * Gets the directional name of an animation based on whether entity can flip and current facing.
			 * <span class="alert"><strong>IMPORTANT:</strong> this method is biased towards facing vertical.</span>
			 * @param {String} animName base animation name
			 * @returns {String} directional animation name
			 * @example
			 * // if we begin with an animation named "move"
			 * // and this entity can flip horizontally
			 * var animName = entity.getAnimName( "move" );
			 * // the result will be "moveX"
			 * // while if the entity cannot flip horizontally
			 * // but it is facing to the left
			 * entity.facing.x = -1;
			 * // the result will be "moveLeft"
			 */
			getDirectionalAnimName: function ( animName ) {
				
				if (this.facing.y !== 0) {
					
					if (this.canFlipY) {
						
						return animName + "Y";

					}
					else if ( this.facing.y < 0 ) {
						
						return animName + "Up";

					}
					else {
						
						return animName + "Down";

					}

				}
				else {
					
					if (this.canFlipX) {
						
						return animName + "X";

					}
					else if ( this.facing.x < 0 ) {
						
						return animName + "Left";

					}
					else {
						
						return animName + "Right";

					}

				}
				
			},

            /**
             * Refreshes entity size, position, etc when screen is resized or linked to is refreshed.
             * <span class="alert alert-info"><strong>Tip:</strong> usually this is best applied to UI elements and not dynamic entities.</span>
             * @param {Boolean} [force] whether to force.
             **/
            refresh: function (force) {

                if ( !this.ignoreSystemScale && this.scale !== ig.system.scale ) {

                    force = true;
                    this.scale = ig.system.scale;

                }
				
				if ( this.needsRebuild ) {
					
					force = true;
					
				}

                this.scaleMod = this.scale / ig.system.scale;

                force = this.resize( force ) || force;

                if ( force ) {

                    this.sizeDraw.x = this.getSizeDrawX();
                    this.sizeDraw.y = this.getSizeDrawY();

                }

                force = this.reposition( force ) || force;

                this.recordChanges(force);
                this.recordLast();

                if ( force ) {

                    this.rebuild();

                }

                this.onRefreshed.dispatch(this);

                if ( this.frozen || ( this.performance !== _c.STATIC && !this._changedAdd ) ) {

                    this.changed = this.moving = this.movingX = this.movingY = false;
					this.facing.x = this.facing.y = 0;

                }

                return force;

            },

            /**
             * Resizes entity.
             * <span class="alert alert-info"><strong>Tip:</strong> by default, this method does nothing, so override this method with a class specific one.</span>
             * @param {Boolean} [force] whether to force.
             */
            resize: function ( force ) {

                return force;

            },

            /**
             * Repositions entity.
             * <span class="alert alert-info"><strong>Tip:</strong> by default, this method does nothing, so override this method with a class specific one.</span>
             * @param {Boolean} [force] whether to force.
             */
            reposition: function ( force ) {

                if ( this.movingTo ) {

                    this.movedTo = false;

                }

                return force;

            },

            /**
             * Rebuilds entity by updating all animations.
             */
            rebuild: function () {

                this.needsRebuild = false;

            },

            /**
             * Called by game when entity added to game world.
             * <span class="alert"><strong>IMPORTANT:</strong> for stability, do not override this method, instead use {@link ig.EntityExtended#ready}</span>
             * @see ig.Entity.
             * @private
             **/
            adding: function () {

                this.ready();

                this.onAdded.dispatch(this);

            },

            /**
             * Called automatically when entity added to game world.
             * @see ig.Entity.
             **/
            ready: function () {

                // initialize performance

                this.changePerformance();

                // resizing and refreshing

                if (this.linkedTo) {

                    this.link(this.linkedTo, this.linkedTo.added);

                }
                else {

                    ig.system.onResized.add(this.refresh, this);

                }

                // play spawn animation
				
				var animNameSpawn = this.getDirectionalAnimName( "spawn" );

                if ( this.anims[ animNameSpawn ] ) {

                    this.animOverride(animNameSpawn, {
                        callback: this.spawn
                    });

                }
                else {

                    this.spawn();

                }

            },

            /**
             * Called after {@link ig.EntityExtended#ready} when spawn animation is complete.
             * <br>- sets {@link ig.EntityExtended#currentAnim} to {@link ig.EntityExtended#animInit} if present
             * <br>- activates entity if {@link ig.EntityExtended#activated} is true
             **/
            spawn: function () {

                // set initial animation

                if (this.animInit instanceof ig.Animation ) {

                    this.currentAnim = this.animInit;

                }
                else if (this.animInit) {

                    this.currentAnim = this.anims[ this.animInit ];

                }
                else {

                    this.currentAnim = this.anims[ 'idle' ] || this.currentAnim;

                }

                if ( this.currentAnim ) {

                    this.resetState.currentAnim = this.currentAnim;

                    if ( !this.currentAnim.stop ) {

                        this.currentAnim.playFromStart();

                    }

                }

                // start activated when activated upon init

                if (this.activated) {

                    this.activate();

                }

            },

            /**
             * Sets this entity's performance level.
             **/
            setPerformance: function (level) {

                this.performance = level;

                if (this.performance !== this.performanceLast) {

                    this.changePerformance();

                }

            },

            /**
             * Makes changes based on this entity's performance level.
             * @returns {Boolean} whether changed or not.
             **/
            changePerformance: function () {

                this.performanceLast = this.performance;

                // movable
                if (this.performance === _c.MOVABLE) {

                    this.changePerformanceMovable();

                }
                // dynamic
                else if (this.performance === _c.DYNAMIC) {

                    this.changePerformanceDynamic();

                }
                // default to static
                else {

                    this.changePerformanceStatic();

                }

            },

            /**
             * Called when performance changed to static.
             **/
            changePerformanceStatic: function () {
            },

            /**
             * Called when performance changed to movable.
             **/
            changePerformanceMovable: function () {
            },

            /**
             * Called when performance changed to dynamic.
             **/
            changePerformanceDynamic: function () {
            },

            /**
             * Sets whether entity can control self.
             * @param {Boolean} [controllable=true]
             **/
            setControllable: function ( controllable ) {

                if ( typeof controllable === 'undefined' ) {

                    controllable = true;

                }

                if ( !controllable ) {

                    this.removeControl();

                }
                else {

                    this.addControl();

                }

            },

            /**
             * Adds control to entity.
             * <span class="alert alert-info"><strong>Tip:</strong> this allows entity to call {@link ig.GameExtended#updateChanges} during update cycle.</span>
             **/
            addControl: function () {

                this.controllable = true;

            },

            /**
             * Removes control from entity.
             * <span class="alert alert-info"><strong>Tip:</strong> this blocks entity from calling {@link ig.GameExtended#updateChanges} during update cycle.</span>
             **/
            removeControl: function () {

                this.controllable = false;

                this.applyAntiVelocity();

            },

            /**
             * Gets entity layer based on {@link ig.EntityExtended#layerName}.
             * @returns {ig.Layer} layer this entity is on.
             **/
            getLayer: function () {

                return ig.game.layersMap[ this.layerName ];

            },

            /**
             * Calculates entity's bounds.
             * <br>- bounds are in world space and are not scaled to window
             * <br>- if bounds are needed, use {@link ig.EntityExtended#needsBounds}
             * @returns {Object} entity's bounds.
             * @example
             * // this is a bad idea
             * var bounds = entity.getBounds();
             * // this is a good idea
             * var bounds = entity.bounds;
             **/
            getBounds: function () {

                var bounds = this.bounds;
				
				if ( !bounds ) {
					
					bounds = this.bounds = {};
					
				}

                bounds.minX = this.pos.x;
                bounds.minY = this.pos.y;
                bounds.maxX = this.pos.x + this.size.x;
                bounds.maxY = this.pos.y + this.size.y;
                bounds.width = this.size.x;
                bounds.height = this.size.y;

                return bounds;

            },

            /**
             * Calculates entity's bounds for drawing.
             * <br>- bounds are in world space and are not scaled to window
             * <br>- if bounds are needed, use {@link ig.EntityExtended#needsBounds}
             * @returns {Object} entity's drawing bounds.
             * @example
             * // this is a bad idea
             * var boundsDraw = entity.getBoundsDraw();
             * // this is a good idea
             * var boundsDraw = entity.boundsDraw;
             **/
            getBoundsDraw: function () {

                var bounds = this.boundsDraw;
				
				if ( !bounds ) {
					
					bounds = this.boundsDraw = {};
					
				}

                var minX = this.posDraw.x;
                var minY = this.posDraw.y;

                bounds.minX = minX;
                bounds.minY = minY;
                bounds.maxX = minX + this.sizeDraw.x;
                bounds.maxY = minY + this.sizeDraw.y;
                bounds.width = this.sizeDraw.x;
                bounds.height = this.sizeDraw.y;

                if ( this.angle !== 0 ) {

                    bounds = ig.utilsintersection.boundsCopyRotated( bounds, bounds, this.angle );

                }

                return bounds;

            },

            /**
             * Calculates vertices based on entity's size.
             * <br>- vertices are relative to entity, not world space, and are not scaled to window
             * <br>- instead of calling this, use {@link ig.EntityExtended#vertices}
             * @returns {Array} vertices.
             * @example
             * // normally, vertices are never calculated
             * // but you can force vertices to be updated on change
             * entity.needsVertices = true;
             * // this is a bad idea
             * var vertices = entity.getVertices();
             * // this is a good idea
             * var vertices = entity.vertices;
             **/
            getVertices: function () {

                var sizeX = this.size.x * 0.5;
                var sizeY = this.size.y * 0.5;

                return [
                    _utv2.vector(-sizeX, -sizeY),
                    _utv2.vector(sizeX, -sizeY),
                    _utv2.vector(sizeX, sizeY),
                    _utv2.vector(-sizeX, sizeY)
                ];

            },

            /**
             * Calculates vertices in world space.
             * <br>- verticesWorld are in world space and are not scaled to window
             * <br>- instead of calling this, use {@link ig.EntityExtended#verticesWorld}
             * @returns {Array} vertices.
             * @example
             * // normally, vertices are never calculated
             * // but you can force vertices to be updated on change
             * entity.needsVertices = true;
             * // this is a bad idea
             * var verticesWorld = entity.getVerticesWorld();
             * // this is a good idea
             * var verticesWorld = entity.verticesWorld;
             **/
            getVerticesWorld: function () {

                // ensure vertices exist

                if (!this.vertices) {

                    this.vertices = this.getVertices();

                }

                return _utv2.projectPoints(
                    this.vertices,
                    this.pos.x + this.size.x * 0.5,
					this.pos.y + this.size.y * 0.5,
                    1, 1,
                    this.angle
                );

            },

            /**
             * Calculates horizontal size, offset included.
             * @returns {Number} total horizontal size.
             **/
            getSizeDrawX: function () {

                return this.size.x + this.offset.x * 2;

            },

            /**
             * Calculates horizontal size, offset included.
             * @returns {Number} total vertical size.
             **/
            getSizeDrawY: function () {

                return this.size.y + this.offset.y * 2;

            },

            /**
             * Calculates entity's draw x position, offset included.
             * @returns {Number} draw x position.
             **/
            getPosDrawX: function () {

                return this.pos.x - this.offset.x;

            },

            /**
             * Calculates entity's draw y position, offset included.
             * @returns {Number} draw y position.
             **/
            getPosDrawY: function () {

                return this.pos.y - this.offset.y;

            },

            /**
             * Calculates entity's center x position.
             * @returns {Number} horizontal center.
             **/
            getCenterX: function () {

                return this.pos.x + this.size.x * 0.5;

            },

            /**
             * Calculates entity's center x position.
             * @returns {Number} vertical center.
             **/
            getCenterY: function () {

                return this.pos.y + this.size.y * 0.5;

            },

            /**
             * Calculates if entity is visible in screen.
             * <br>- instead of calling this, use (@link ig.EntityExtended#visible}
             * @returns {Boolean} if is in screen.
             * @example
             * // this is a bad idea
             * var visible = entity.getIsVisible();
             * // this is a good idea
             * var visible = entity.visible;
             **/
            getIsVisible: function () {

                if (this.alpha <= 0) return false;
                else {

                    if (this.fixed) {

                        return _uti.AABBIntersect(
							this.posDraw.x, this.posDraw.y, this.posDraw.x + this.sizeDraw.x, this.posDraw.y + this.sizeDraw.y,
							0, 0, ig.system.width, ig.system.height
						);

                    }
                    else {

                        var minX = this.posDraw.x - ig.game.screen.x;
                        var minY = this.posDraw.y - ig.game.screen.y;

                        return _uti.AABBIntersect(
							minX, minY, minX + this.sizeDraw.x, minY + this.sizeDraw.y,
							0, 0, ig.system.width, ig.system.height
						);

                    }

                }

            },

            /**
             * Calculates if entity is handling its own movement, i.e. dynamic, moving to, etc.
             * @returns {Boolean} if is handling own movement.
             **/
            getIsMovingSelf: function () {

                return this.performance === _c.DYNAMIC || this.movingTo;

            },

            /**
             * Approximate check of whether this entity is colliding with the one way blocking direction of another other entity.
             * <br>- checks for whether the touching edges are within a certain range based on {@link ig.CONFIG#PRECISION_PCT_ONE_SIDED}
             * <span class="alert"><strong>IMPORTANT:</strong> the non one way entity does this check to allow it to choose whether to ignore one way block.</span>
             * @param {ig.EntityExtended} entityOneWay one way entity to check against.
             * @returns {Boolean} true if this entity is coming from other entity's one way blocking direction.
             */
            getIsCollidingWithOneWay: function (entityOneWay) {

                // check x

                if (entityOneWay.oneWayFacing.x !== 0) {

                    if (entityOneWay.oneWayFacing.x < 0) {

                        if (( this.pos.x + this.size.x ) - entityOneWay.pos.x <= Math.max(entityOneWay.size.x, this.size.x) * _c.PRECISION_PCT_ONE_SIDED + ( this.vel.x > 0 ? this.vel.x * ig.system.tick : 0 )) {

                            return true;

                        }

                    }
                    else if (( entityOneWay.pos.x + entityOneWay.size.x ) - this.pos.x <= Math.max(entityOneWay.size.x, this.size.x) * _c.PRECISION_PCT_ONE_SIDED + ( this.vel.x < 0 ? -this.vel.x * ig.system.tick : 0 )) {

						return true;

                    }

                }

                // check y

                if (entityOneWay.oneWayFacing.y !== 0) {

                    if (entityOneWay.oneWayFacing.y < 0) {

                        if ( ( this.pos.y + this.size.y ) - entityOneWay.pos.y <= Math.max(entityOneWay.size.y, this.size.y) * _c.PRECISION_PCT_ONE_SIDED + ( this.vel.y > 0 ? this.vel.y * ig.system.tick : 0 )) {

                            return true;

                        }

                    }
                    else if ( ( entityOneWay.pos.y + entityOneWay.size.y )  - this.pos.y <= Math.max(entityOneWay.size.y, this.size.y) * _c.PRECISION_PCT_ONE_SIDED + ( this.vel.y < 0 ? -this.vel.y * ig.system.tick : 0 )) {

						return true;

                    }

                }

            },

            /**
             * Whether this entity touches another.
             * @param {ig.EntityExtended} entity entity to check against.
             * @returns {Boolean} if touches other.
             **/
            touches: function (entity) {

                return _uti.AABBIntersect(
					this.pos.x, this.pos.y, this.pos.x + this.size.x, this.pos.y + this.size.y,
					entity.pos.x, entity.pos.y, entity.pos.x + entity.size.x, entity.pos.y + entity.size.y
				);

            },

            /**
             * Calculates distance from center of this entity to center of another.
             * @param {ig.EntityExtended} entity entity to find distance to.
             * @returns {Number} distance
             */
            distanceTo: function( entity ) {

                var distanceX = (this.pos.x + this.size.x * 0.5) - (entity.pos.x + entity.size.x * 0.5);
                var distanceY = (this.pos.y + this.size.y * 0.5) - (entity.pos.y + entity.size.y * 0.5);

                return Math.sqrt( distanceX * distanceX + distanceY * distanceY );

            },

            /**
             * Calculates distance squared from center of this entity to center of another.
             * <br>- this is much faster than distanceTo as it avoids sqrt, but the distance is squared
             * @param {ig.EntityExtended} entity entity to find distance to.
             * @returns {Number} distance squared
             */
            distanceSquaredTo: function( entity ) {

                var distanceX = (this.pos.x + this.size.x * 0.5) - (entity.pos.x + entity.size.x * 0.5);
                var distanceY = (this.pos.y + this.size.y * 0.5) - (entity.pos.y + entity.size.y * 0.5);

                return distanceX * distanceX + distanceY * distanceY;

            },

            /**
             * Calculates distance from edge of this entity to edge of another.
             * @param {ig.EntityExtended} entity entity to find distance to.
             * @returns {Number} distance
             */
            distanceEdgeTo: function( entity ) {

                var minX = this.pos.x;
                var maxX = minX + this.size.x;
                var minY = this.pos.y;
                var maxY = minY + this.size.y;
                var entityMinX = entity.pos.x;
                var entityMaxX = entityMinX + entity.size.x;
                var entityMinY = entity.pos.y;
                var entityMaxY = entityMinY + entity.size.y;
                var distanceX;
                var distanceY;

                if ( maxX < entityMinX ) {

                    distanceX = entityMinX - maxX;

                }
                else if ( minX > entityMaxX ) {

                    distanceX = minX - entityMaxX;

                }
                else {

                    distanceX = 0;

                }

                if ( maxY < entityMinY ) {

                    distanceY = entityMinY - maxY;

                }
                else if ( minY > entityMaxY ) {

                    distanceY = minY - entityMaxY;

                }
                else {

                    distanceY = 0;

                }

                return Math.sqrt( distanceX * distanceX + distanceY * distanceY );

            },

            /**
             * Calculates distance squared from edge of this entity to edge of another.
             * <br>- this is much faster than distanceEdgeTo as it avoids sqrt, but the distance is squared
             * @param {ig.EntityExtended} entity entity to find distance to.
             * @returns {Number} distance
             */
            distanceSquaredEdgeTo: function( entity ) {

                var minX = this.pos.x;
                var maxX = minX + this.size.x;
                var minY = this.pos.y;
                var maxY = minY + this.size.y;
                var entityMinX = entity.pos.x;
                var entityMaxX = entityMinX + entity.size.x;
                var entityMinY = entity.pos.y;
                var entityMaxY = entityMinY + entity.size.y;
                var distanceX;
                var distanceY;

                if ( maxX < entityMinX ) {

                    distanceX = entityMinX - maxX;

                }
                else if ( minX > entityMaxX ) {

                    distanceX = minX - entityMaxX;

                }
                else {

                    distanceX = 0;

                }

                if ( maxY < entityMinY ) {

                    distanceY = entityMinY - maxY;

                }
                else if ( minY > entityMaxY ) {

                    distanceY = minY - entityMaxY;

                }
                else {

                    distanceY = 0;

                }

                return distanceX * distanceX + distanceY * distanceY;

            },

            /**
             * Calculates angle from this entity to another.
             * @param {ig.EntityExtended} entity entity to find angle to.
             * @returns {Number} angle
             */
            angleTo: function( entity ) {
                return Math.atan2(
                    (this.pos.x + this.size.x * 0.5) - (entity.pos.x + entity.size.x * 0.5),
                    (this.pos.y + this.size.y * 0.5) - (entity.pos.y + entity.size.y * 0.5)
                );
            },

            /**
             * Zeroes out velocity.
             **/
            applyAntiVelocity: function () {

                _utv2.zero(this.vel);

            },

            /**
             * Zeroes out horizontal velocity.
             **/
            applyAntiVelocityX: function () {

                this.vel.x = 0;

            },

            /**
             * Zeroes out vertical velocity.
             **/
            applyAntiVelocityY: function () {

                this.vel.y = 0;

            },

            /**
             * Applies velocity to counteract gravity.
             **/
            applyAntiGravity: function () {

                if (this.gravityFactor !== 0) {

                    this.vel.y -= ig.game.gravity * ig.system.tick * this.gravityFactor;

                }

            },

            /**
             * Plays an animation and sets animation as override until complete to ensure that no other animations play.
             * @param {String} animName name of animation to play.
             * @param {Object} [settings] settings object.
             * @example
             * // settings is a plain object
             * settings = {};
             * // use an animation from another entity
             * settings.entity = otherEntity;
             * // don't auto release override
             * settings.lock = true;
             * // loop overriding animation
             * // also does not auto release override
             * settings.loop = true;
             * // play animation in reverse
             * settings.reverse = true;
             * // call a function when override completes
             * settings.callback = function () {...};
             * // call the callback in a context
             * settings.context = callbackContext;
             **/
            animOverride: function (animName, settings) {

                settings = settings || {};
                var entity = settings.entity || this;
                var loop = settings.loop;
                var lock = settings.lock;

                // entity has animation

                if (entity.anims[ animName ]) {

                    // start override

                    if (this.overridingAnimName !== animName) {

                        this.animRelease();

                        this.overridingAnimName = animName;
                        this.overridingAnimCallback = settings.callback;
                        this.overridingAnimContext = settings.context;
                        this.overridingAnimFrozen = this.frozen;

                        // store current to be restored when anim released

                        this._overridedAnim = this.currentAnim;

                        // set current to overriding

                        this.currentAnim = this.overridingAnim = entity.anims[ animName ];

                        // listen for complete of animation if not looping or locked to automatically release override
                        // not allowing this can be dangerous as it requires a manual release of override

                        if (!loop && !lock) {

                            this.overridingAnim.onCompleted.addOnce(this.animRelease, this);

                        }

                    }

                    // reset override

                    if (this.frozen) {

                        this.frozen = false;

                    }

                    // play from start and only play once

                    this.overridingAnim.playFromStart(!loop, settings.reverse);

                }
                // release override
                else if (typeof settings.callback === 'function') {

                    this.animRelease(true);

                    settings.callback.call(settings.context || this);

                }

            },

            /**
             * Removes animation override, see ig.EntityExtended.animOverride.
             * @param {Boolean} [silent] whether to suppress callback.
             **/
            animRelease: function (silent) {

                // store callback/context and clear override

                var callback = this.overridingAnimCallback;
                var context = this.overridingAnimContext;

                if (this.overridingAnimFrozen) {

                    this.frozen = this.overridingAnimFrozen;

                }

                if (this.overridingAnim) {

                    this.overridingAnim.onCompleted.remove(this.animRelease, this);
                    this.overridingAnim.stop = true;

                    this.currentAnim = this._overridedAnim;

                    this.overridingAnimName = this.overridingAnim = this._overridedAnim = this.overridingAnimCallback = this.overridingAnimContext = undefined;

                }

                // do callback

                if (!silent && callback) {

                    callback.call(context || this);

                }

            },

            initOpaqueVertices: function () {

                this.opaqueVertices = [
                    _utv2.vector(),
                    _utv2.vector(),
                    _utv2.vector(),
                    _utv2.vector()
                ];

            },

            getOpaqueVertices: function () {

                var width = this.size.x;
                var height = this.size.y;

                var x = this.pos.x;
                var y = this.pos.y;

                // get offsets

                var opaqueOffset = this.opaqueOffset;

                // offset by animation and tile

                if ( this.currentAnim && this.currentAnim.opaqueOffset ) {

                    opaqueOffset = ( this.currentAnim.opaqueOffset.tiles && this.currentAnim.opaqueOffset.tiles[ this.currentAnim.tile ] ) || this.currentAnim.opaqueOffset;

                }

                var minX = x + opaqueOffset.left;
                var minY = y + opaqueOffset.top;
                var maxX = x + width + opaqueOffset.right;
                var maxY = y + height + opaqueOffset.bottom;

                var cX = x + width * 0.5;
                var cY = y + height * 0.5;

                var tl = this.opaqueVertices[0];
                var tr = this.opaqueVertices[1];
                var br = this.opaqueVertices[2];
                var bl = this.opaqueVertices[3];

                if ( this.angle !== 0 ) {

                    var cos = Math.cos( this.angle );
                    var sin = Math.sin( this.angle );
                    var dminX = minX - cX;
                    var dminY = minY - cY;
                    var dmaxX = maxX - cX;
                    var dmaxY = maxY - cY;

                    tl.x = cX + dminX * cos - dminY * sin;
                    tl.y = cY + dminX * sin + dminY * cos;
                    tr.x = cX + dmaxX * cos - dminY * sin;
                    tr.y = cY + dmaxX * sin + dminY * cos;
                    br.x = cX + dmaxX * cos - dmaxY * sin;
                    br.y = cY + dmaxX * sin + dmaxY * cos;
                    bl.x = cX + dminX * cos - dmaxY * sin;
                    bl.y = cY + dminX * sin + dmaxY * cos;

                }
                else {

                    tl.x = minX;
                    tl.y = minY;
                    tr.x = maxX;
                    tr.y = minY;
                    br.x = maxX;
                    br.y = maxY;
                    bl.x = minX;
                    bl.y = maxY;

                }

                return this.opaqueVertices;

            },

            /**
             * Fill context with the shadow cast by this entity from a point within a light, constrained by the given bounds.
             * @param {ig.EntityLight} light to cast shadows from
             * @param {CanvasRenderingContext2D} context The canvas context onto which the shadows will be cast.
             * @param {Object} point point that represents where the light is coming from.
             * @param {Number} minX left position of light
             * @param {Number} minY top position of light
             * @param {Number} radius radius of light
             **/
            castShadow: function (light, context, point, minX, minY, radius) {

                // ensure casting properties are ready

                if (!this._contours) {

                    this._utilVec2Cast1 = _utv2.vector();
                    this._utilVec2Cast2 = _utv2.vector();
                    this._utilVec2Cast3 = _utv2.vector();
                    this._utilVec2Cast4 = _utv2.vector();

                    this._utilVec2Project1 = _utv2.vector();
                    this._utilVec2Project2 = _utv2.vector();
                    this._utilVec2Project3 = _utv2.vector();
                    this._utilVec2Project4 = _utv2.vector();

                    this._contourPool = [];
                    this._contours = [];

                }

                if ( this.opaqueFromVertices ) {

                    if ( !this._verticesFound ) {

                        this.opaqueVertices = this.verticesWorld = this.getVerticesWorld();

                    }

                }
                else {

                    if ( !this.opaqueVertices ) {

                        this.initOpaqueVertices();

                    }

                    if (!this._verticesFound) {

                        this.getOpaqueVertices();

                    }

                }

                this._verticesFound = true;

                // cast no shadows if light is within these bounds and this is not hollow

                if (!this.hollow && _uti.pointInPolygon(point.x, point.y, this.opaqueVertices)) {

                    return;

                }

                var alpha = this.diffuse >= 1 || light.diffuse >= 1 ? 1 : this.diffuse * light.diffuse;
                var opaqueVertices = this.opaqueVertices;
				var maxX = minX + radius * 2;
				var maxY = minY + radius * 2;
                var withinLight = false;
                var contourPool = this._contourPool, contours = this._contours;
                var contour, contourVertices;
                var contourOther, contourOtherVertices;
                var oa, ob, oc, od, combined;
                var a = opaqueVertices[ opaqueVertices.length - 1 ], b, c, d;
                var i, il, j, jl, k, kl;

                // check each segment;

                for (i = 0, il = opaqueVertices.length; i < il; i++) {

                    b = opaqueVertices[ i ];

                    // check if line is within light
					
					var abMinX;
					var abMinY;
					var abMaxX;
					var abMaxY;
					
					if ( a.x < b.x ) {
						
						abMinX = a.x;
						abMaxX = b.x;
					
					}
					else {
						
						abMinX = b.x;
						abMaxX = a.x;
						
					}
					
					if ( a.y < b.y ) {
						
						abMinY = a.y;
						abMaxY = b.y;
					
					}
					else {
						
						abMinY = b.y;
						abMaxY = a.y;
						
					}

                    if (_uti.AABBIntersect(
                        abMinX, abMinY, abMaxX, abMaxY,
                        minX, minY, maxX, maxY
                    )) {

                        withinLight = true;

                        // check if line is facing away from point
                        // dot gives us angle domain between normal of A to B and vector pointing from point to A
                        // dot > 0 = angle < 90, so line would be facing away

                        var aToB = _utv2.copy(this._utilVec2Cast1, b);
                        _utv2.subtract(aToB, a);
                        var normal = _utv2.set(this._utilVec2Cast2, aToB.y, -aToB.x);
                        var pointToA = _utv2.copy(this._utilVec2Cast3, a);
                        _utv2.subtract(pointToA, point);

                        if (_utv2.dot(normal, pointToA) > 0) {

                            var pointToB = _utv2.copy(this._utilVec2Cast4, b);
                            _utv2.subtract(pointToB, point);

                            // project a and b to edge of light and get shape

                            contourPool.push({
                                vertices: this.projectShadow( point, radius, a, b, pointToA, pointToB, aToB),
                                verticesActual: [ a, b ],
                                verticesHollow: []
                            });

                        }

                    }

                    a = b;

                }

                if ( withinLight ) {

                    // process contours and combine any touching

                    for (i = 0, il = contourPool.length; i < il; i++) {

                        contour = contourPool[ i ];
                        contourVertices = contour.vertices;
                        combined = false;

                        a = contourVertices[ 0 ];
                        b = contourVertices[ 1 ];
                        c = contourVertices[ contourVertices.length - 2 ];
                        d = contourVertices[ contourVertices.length - 1 ];

                        // check every following contour for duplicate start or end

                        for (j = i + 1; j < il; j++) {

                            contourOther = contourPool[ j ];
                            contourOtherVertices = contourOther.vertices;
                            oa = contourOtherVertices[ 0 ];
                            ob = contourOtherVertices[ 1 ];
                            oc = contourOtherVertices[ contourOtherVertices.length - 2 ];
                            od = contourOtherVertices[ contourOtherVertices.length - 1 ];

                            // discard b, and od, and join contours [ contourOther, contour ] with a at end
                            if (_utv2.equal(a, od) && _utv2.equal(b, oc)) {

                                combined = true;

                                contourPool[ j ] = {
                                    vertices: contourOtherVertices.slice(0, -1).concat(contourVertices.slice(2)),
                                    verticesActual: contourOther.verticesActual.slice(0, -1).concat(contour.verticesActual),
                                    verticesHollow: contour.verticesHollow.concat(a, contourOther.verticesHollow)
                                };

                                break;

                            }
                            // discard d, oa, and ob and join contours [ contour, contourOther ]
                            else if (_utv2.equal(c, ob) && _utv2.equal(d, oa)) {

                                combined = true;

                                contourPool[ j ] = {
                                    vertices: contourVertices.slice(0, -1).concat(contourOtherVertices.slice(2)),
                                    verticesActual: contour.verticesActual.slice(0, -1).concat(contourOther.verticesActual),
                                    verticesHollow: contourOther.verticesHollow.concat(d, contour.verticesHollow)
                                };

                                break;

                            }

                        }

                        if (combined !== true) {

                            contours.push(contour);

                        }

                    }

                    // fill in this shape
                    // check all contours and for any with a matching vertex, combine into one contour

                    if (!this.hollow) {

                        var vertices = opaqueVertices.slice(0);

                        var connections = {};
                        var connection = [];
                        var connected = false;

                        // walk self vertices
                        // check for any vertices in self that match contour's actual vertices
                        // create connections between contours from vertices that do not match

                        for (i = 0, il = vertices.length; i < il; i++) {

                            var vertex = vertices[ i ];
                            var matched = false;

                            for (j = 0, jl = contours.length; j < jl; j++) {

                                contour = contours[ j ];
                                var contourVerticesActual = contour.verticesActual;

                                for (k = 0, kl = contourVerticesActual.length; k < kl; k++) {

                                    var vertexActual = contourVerticesActual[ k ];

                                    if (vertex.x === vertexActual.x && vertex.y === vertexActual.y) {

                                        matched = true;

                                        if (connection) {

                                            connections[ j === 0 ? jl - 1 : j - 1 ] = connection;
                                            connection = undefined;
                                            connected = true;

                                        }

                                        break;

                                    }

                                }

                                if (matched === true) {

                                    break;

                                }

                            }

                            // not matched, put into last connection

                            if (matched === false) {

                                if (!connection) {

                                    connection = [];

                                }

                                connection.push(vertex);

                            }


                        }

                        // handle last connection

                        if (connection) {

                            connections[ jl - 1 ] = connection !== connections[ jl - 1 ] ? connection.concat(connections[ jl - 1 ] || []) : connection;

                        }

                        // if at least one connection
                        // combine all contours and connections

                        if (connected) {

                            var contourConnected = {
                                vertices: []
                            };

                            for (i = 0, il = contours.length; i < il; i++) {

                                contour = contours[ i ];

                                // add contour and connection

                                contourConnected.vertices = contourConnected.vertices.concat(contour.vertices, connections[ i ] || []);

                            }

                            contours = [ contourConnected ];

                        }
                        // no connections so just add self
                        else {

                            contours.push({
                                vertices: vertices
                            });

                        }

                    }
                    // add all hollow vertices to end of contours
                    else {

                        for (i = 0, il = contours.length; i < il; i++) {

                            contour = contours[ i ];

                            contour.vertices = contour.vertices.concat(contour.verticesHollow);

                        }

                    }

                    // draw each contour

                    if (light.pixelPerfect) {

                        for (i = 0, il = contours.length; i < il; i++) {

                            contour = contours[ i ];
                            _utd.pixelFillPolygon(
								context, 
								minX, minY, maxX, maxY,
								contour.vertices, 1, 1, 1, alpha, true,
								_uti.boundsOfPoints(contour.vertices)
							);

                        }

                    }
                    else {

                        context.fillStyle = _utc.RGBAToCSS( 1, 1, 1, alpha );

                        for (i = 0, il = contours.length; i < il; i++) {

                            contour = contours[ i ];
                            _utd.fillPolygon(context, contour.vertices, -minX, -minY, light.scale);

                        }

                    }

                    // clear contour lists

                    contourPool.length = contours.length = 0;

                }

            },

            /**
             * Projects an edge based on an point.
             * @param {Vector2|Object} point 2d point to project from.
             * @param {Number} radius
             * @param {Object} a edge vertex a.
             * @param {Object} b edge vertex b.
             * @param {Vector2|Object} pointToA 2d vector from point to vertex a.
             * @param {Vector2|Object} pointToB 2d vector from point to vertex b.
             * @param {Object} aToB 2d vector from vertex a to vertex b.
             * @returns {Array} vertices of the shape cast by light from edge.
             **/
            projectShadow: function (point, radius, a, b, pointToA, pointToB, aToB) {

                var pointToAB = this._utilVec2Project1; // projected point of point to [a, b]
                var invOriginToA = _utv2.copy(this._utilVec2Project2, pointToA);
                _utv2.inverse(invOriginToA);

                var t = _utv2.dot(aToB, invOriginToA) / _utv2.lengthSquared(aToB);

                if (t < 0) {

                    _utv2.copy(pointToAB, a);

                }
                else if (t > 1) {

                    _utv2.copy(pointToAB, b);

                }
                else {

                    _utv2.copy(pointToAB, a);

                    var n = _utv2.copy(this._utilVec2Project3, aToB);
                    _utv2.multiplyScalar(n, t)
                    _utv2.add(pointToAB, n);

                }

                var pointToM = _utv2.copy(this._utilVec2Project4, pointToAB);
                _utv2.subtract(pointToM, point);

                // normalize to radius

                _utv2.normalize(pointToM);
                _utv2.multiplyScalar(pointToM, radius);

                _utv2.normalize(pointToA);
                _utv2.multiplyScalar(pointToA, radius);

                _utv2.normalize(pointToB);
                _utv2.multiplyScalar(pointToB, radius);

                // project points

                var ap = _utv2.clone(a);
                _utv2.add(ap, pointToA);

                var bp = _utv2.clone(b);
                _utv2.add(bp, pointToB);

                // return in clockwise order, with intermediary points to ensure full cover
                // if t < 0, ap === oam, so ignore intermediary oam
                // if t > 1, bp === obm, so ignore intermediary obm

                var oam, obm;

                if (t < 0) {

                    obm = _utv2.clone(b);
                    _utv2.add(obm, pointToM);

                    return [ a, ap, obm, bp, b ];

                }
                else if (t > 1) {

                    oam = _utv2.clone(a);
                    _utv2.add(oam, pointToM);

                    return [ a, ap, oam, bp, b ];

                }
                else {

                    oam = _utv2.clone(a);
                    _utv2.add(oam, pointToM);

                    obm = _utv2.clone(b);
                    _utv2.add(obm, pointToM);

                    return [ a, ap, oam, obm, bp, b ];

                }

            },

            /**
             * Do some activated behavior.
             * @param {Entity} [entity] causing activation.
             **/
            activate: function (entity) {

                this.activated = true;

                // do activate callback
                // useful for entities that are built dynamically
                // instead of predefined entity classes

                if (this.activateCallback) {

                    this.activateCallback.call(this.activateContext || this, entity);

                }

            },

            /**
             * Do some deactivated behavior.
             * @param {Entity} [entity] causing deactivation.
             **/
            deactivate: function (entity) {

                this.activated = false;

                // do deactivate callback
                // useful for entities that are built dynamically
                // instead of predefined entity classes

                if (this.deactivateCallback) {

                    this.deactivateCallback.call(this.deactivateContext || this, entity);

                }

            },

            /**
             * Toggles between activate and deactivate.
             * @param {Entity} [entity] causing deactivation.
             */
            toggleActivate: function (entity) {

                if (!this.alwaysToggleActivate && this.activated) {

                    this.deactivate(entity);

                }
                else {

                    this.activate(entity);

                }

            },

            /**
             * Convenience function for tween fade to max alpha.
             * @param {Object} [settings] settings for tween.
             * @returns {Tween} tween object.
             **/
            fadeIn: function (settings) {

                return this.fadeTo(1, settings);

            },

            /**
             * Convenience function for tween fade out.
             * @param {Object} [settings] settings for tween.
             * @returns {Tween} tween object.
             **/
            fadeOut: function (settings) {

                return this.fadeTo(0, settings);

            },

            /**
             * Simple fade to specified alpha.
             * @param {Number} alpha alpha value between 0 and 1.
             * @param {Object} [settings] settings for tween.
             * @returns {Tween} tween object.
             **/
            fadeTo: function (alpha, settings) {

                // default settings

                settings = ig.merge({
                    name: 'fade',
                    duration: _c.DURATION_FADE
                }, settings);

                return this.tween({ alpha: alpha || 0 }, settings);

            },

            /**
             * Convenience function for tween fade out and then kill.
             * @param {Object} [settings] settings for tween.
             * @returns {Tween} tween object.
             **/
            fadeToDeath: function (settings) {

                settings = settings || {};

                // insert complete callback to kill this entity

                var me = this;
                var onCompleteOriginal = settings.onComplete;

                settings.onComplete = function () {

                    ig.game.removeEntity(me);

                    if ( onCompleteOriginal ) {

                        onCompleteOriginal();

                    }

                };

                return this.fadeTo(0, settings);

            },

            /**
             * Simple tween of specified properties.
             * <span class="alert"><strong>IMPORTANT:</strong> make sure this entity has all tweening properties.</span>
             * @param {Object} properties property values on entity.
             * @param {Object} [settings] settings for tween, based on {@link ig.tweens.tween}.
             * @returns {Tween} tween object.
             **/
            tween: function (properties, settings) {

                var me = this;

                settings = settings || {};

                // stop previous tween

                var name = settings.name || 'tween';
                var tween = this.tweens[ name ];
                if (tween) {

                    tween.stop();

                }

                // set pause signaller

                settings.pauseSignaller = settings.pauseSignaller || this;

                // set up auto complete and delete

                if (!settings.noComplete) {

                    var onComplete = settings.onComplete;

                    settings.onComplete = function () {

                        delete me.tweens[ name ];

                        if (typeof onComplete === 'function') {

                            onComplete();

                        }

                    };

                }

                // tween

                return this.tweens[ name ] = _tw.tween(
                    this,
                    properties,
                    settings
                );

            },

            /**
             * Stops tweens on this entity.
             * <span class="alert"><strong>IMPORTANT:</strong> if no specific tween name passed, will stop all tweens.</span>
             * @param {String} [name] name of specific tween.
             **/
            tweenEnd: function (name) {

                // name of specific tween passed

                if (typeof name === 'string') {

                    var tween = this.tweens[ name ];

                    if (tween) {

                        tween.stop();
                        delete this.tweens[ name ];

                    }

                }
                // clear all tweens
                else {

                    for (name in this.tweens) {

                        this.tweenEnd(name);

                    }

                }

            },

            /**
             * Moves to an item, which can be an entity or a position.
             * @param {ig.EntityExtended|Vector2|Object} item entity with bounds or position with x and y properties.
             * @param {Object} [settings] settings for move.
             * @returns {Boolean} whether a new move to has been started
             * @example
             * // settings is a plain object
             * settings = {};
             * // to ensure entity follows other properly
             * settings.matchPerformance = true;
             * // to move to only once
             * settings.once = true;
             * // follow defaults to aligning at center of followed
             * // to follow at the top left instead of center
             * settings.align = { x: 0, y: 0 };
             * // to follow offset by 10 px
             * settings.offset = { x: 10, y: 10 };
             * // to follow above
             * settings.offsetPct = { x: 0, y: -1 };
             * // to follow at a random offset between -0.25 and 0.25 on both axes
             * settings.randomOffsetPct = { x: 0.25, y: 0.25 };
             * // a lerp between 0 and 1 will cause a smooth follow
             * settings.lerp = 0.1;
             * // a tweened follow with optional tween settings based on {@link ig.EntityExtended#tween}
             * settings.tween = true;
             * settings.tweenSettings = {...};
             */
            moveTo: function ( item, settings ) {

                // not already moving to

                if (item && this.movingTo !== item) {

                    settings = settings || {};

                    // check if is sequence

                    if (_ut.isArray(item)) {

                        if ( item.length === 0 ) {

                            return;

                        }

                        // copy entity sequence

                        this.movingToSequence = item.slice(0);

                        // move to first

                        item = this.movingToSequence.shift();

                        if (this.movingTo === item) {

                            return;

                        }

                        // moveTo shouldn't be more than once

                        this.movingToOnce = true;

                    }

                    // clear previous

                    this.moveToStop();

                    // check moving to once

                    if (typeof settings.once !== 'undefined') {

                        this.movingToOnce = settings.once;

                    }

                    // when item is entity

                    var singleMove;

                    if ( item instanceof ig.EntityExtended ) {

                        // match performance of entity to follow
                        // this ensures static entities will be able to follow non static
                        // and that we don't waste performance constantly updating follow of static entities

                        if (settings.matchPerformance) {

                            var performance = item.performance;

                            // dynamic to movable for proper follow

                            if (performance === _c.DYNAMIC) {

                                performance = _c.MOVABLE;

                            }

                            this.setPerformance(performance);

                        }

                        singleMove = this.performance === _c.STATIC || ( this.performance !== _c.DYNAMIC && item.performance === _c.STATIC );

                    }
                    else {

                        singleMove = this.performance === _c.STATIC

                    }

                    // random offsets

                    if (settings.randomOffsetPct) {

                        // set base in case settings are reused

                        settings.baseOffsetPct = settings.baseOffsetPct || settings.offsetPct || _utv2.vector();

                        // ensure random offset has both x and y

                        var randomOffsetPct = settings.randomOffsetPct;

                        randomOffsetPct.x = randomOffsetPct.x || 0;
                        randomOffsetPct.y = randomOffsetPct.y || 0;

                        // combine base offset with random offset

                        settings.offsetPct = _utv2.vector(
                            settings.baseOffsetPct.x + ( Math.random() * 2 * randomOffsetPct.x - randomOffsetPct.x ),
                            settings.baseOffsetPct.y + ( Math.random() * 2 * randomOffsetPct.y - randomOffsetPct.y )
                        );

                    }

                    // no need to constantly follow if this is not movable or item to follow is static, and not lerping or tweening

                    if ( singleMove && !settings.lerp && !settings.tween) {

                        this.moveToPosition(item, settings);
                        this.recordChanges();

                    }
                    else {

                        // make sure we are not frozen

                        this.frozen = false;

                        this.movingTo = item;
                        this.movedTo = false;
                        this.movingToSettings = settings;

                        // moveTo is a tween

                        if ( settings.tween && this.performance !== _c.DYNAMIC ) {

                            this.movingToTweening = true;
                            this.movingToTweenPct = 0;
                            this.movingToTweenX = this.pos.x;
                            this.movingToTweenY = this.pos.y;

                            // tween settings

                            var tweenSettings = settings.tweenSettings = settings.tweenSettings || {};
                            tweenSettings.name = "movingTo";
                            tweenSettings.onComplete = function () {

                                this.moveToUpdate();
                                this.moveToComplete();

                            }.bind(this);

                            // tween pct to 1

                            this.tween({ movingToTweenPct: 1 }, tweenSettings);

                        }

                        return true;

                    }

                }

                return false;

            },

            /**
             * Moves to next in current sequence of moving to entities.
             **/
            moveToSequenceNext: function () {

                // moving to sequence

                if (this.movingToSequence) {

                    // another to move to

                    if (this.movingToSequence.length > 0) {

                        // remove moving to temporarily so moveTo doesn't reset properties

                        this.movingTo = null;

                        this.moveTo(this.movingToSequence.shift(), this.movingToSettings);

                    }
                    // none left, end sequence
                    else {

                        this.movingToSequence = undefined;
                        this.moveToComplete();
                        this.moveToStop();

                    }

                }

            },

            /**
             * Updates any moveTo in progress.
             **/
            moveToUpdate: function () {

                if (this.movingTo && ( !this.movedTo || this.movingTo.changed ) ) {

                    this.moveToPosition(this.movingTo, this.movingToSettings);

                }

            },

            /**
             * Positions this entity relative to moving to item based on settings.
             * @param {ig.EntityExtended|Vector2|Object} item item to move to.
             * @param {Object} [settings] settings object.
             **/
            moveToPosition: function (item, settings) {

                var targetX = 0;
                var targetY = 0;
                var alignX = 0.5;
                var alignY = 0.5;

                // item is entity and needs different handling

                if ( item instanceof ig.EntityExtended ) {

                    if ( settings ) {

                        var align = settings.align;

                        if ( align ) {

                            if ( typeof align.x !== 'undefined' ) {

                                alignX = align.x;

                            }

                            if ( typeof align.y !== 'undefined' ) {

                                alignY = align.y;

                            }

                        }

                        var offset = settings.offset;

                        if (offset) {

                            targetX += offset.x || 0;
                            targetY += offset.y || 0;

                            this.flip = item.flip;

                        }

                        var offsetPct = settings.offsetPct;

                        if (offsetPct) {

                            var offsetX = offsetPct.x || 0;
                            var offsetY = offsetPct.y || 0;

                            targetX += ( offsetX * item.size.x * 0.5 + offsetX * this.size.x * 0.5 ) * ( item.flip.x ? -1 : 1 );
                            targetY += offsetY * item.size.y * 0.5 + offsetY * this.size.y * 0.5;

                            this.flip = item.flip;

                        }

                    }

                    var scaleMod = this.scale / item.scale;

                    targetX += item.pos.x + alignX * ( item.size.x - this.size.x * scaleMod );
                    targetY += item.pos.y + alignY * ( item.size.y - this.size.y * scaleMod );

                    if ( this.fixed ) {

                        if ( !item.fixed ) {

                            targetX -= ig.game.screen.x;
                            targetY -= ig.game.screen.y;

                        }

                    }
                    else {

                        if ( item.fixed ) {

                            targetX += ig.game.screen.x;
                            targetY += ig.game.screen.y;

                        }

                    }

                }
                // assume item is position
                else {

                    if ( settings ) {

                        var align = settings.align;

                        if ( align ) {

                            if ( typeof align.x !== 'undefined' ) {

                                alignX = align.x;

                            }

                            if ( typeof align.y !== 'undefined' ) {

                                alignY = align.y;

                            }

                        }

                        var offset = settings.offset;

                        if (offset) {

                            targetX += offset.x || 0;
                            targetY += offset.y || 0;

                        }

                        var offsetPct = settings.offsetPct;

                        if (offsetPct) {

                            var offsetX = offsetPct.x || 0;
                            var offsetY = offsetPct.y || 0;

                            targetX += offsetX * this.size.x * 0.5;
                            targetY += offsetY * this.size.y * 0.5;

                        }

                    }

                    targetX += item.x + alignX * this.size.x;
                    targetY += item.y + alignY * this.size.y;

                    if ( this.fixed ) {

                        targetX -= ig.game.screen.x;
                        targetY -= ig.game.screen.y;

                    }

                }

                var dx = targetX - this.pos.x;
                var dy = targetY - this.pos.y;

                // tween

                if (this.movingToTweening) {

                    this.pos.x = this.movingToTweenX + ( targetX - this.movingToTweenX ) * this.movingToTweenPct;
                    this.pos.y = this.movingToTweenY + ( targetY - this.movingToTweenY ) * this.movingToTweenPct;

                }
                // lerp
                else if (settings && settings.lerp) {

                    this.pos.x += dx * settings.lerp;
                    this.pos.y += dy * settings.lerp;

                }
                // instantly
                else {

                    this.pos.x = targetX;
                    this.pos.y = targetY;

                }

                // check if done

                if ( _utm.almostEqual(dx, 0, _c.PRECISION_ZERO)
                    && _utm.almostEqual(dy, 0, _c.PRECISION_ZERO) ) {

                    this.moveToComplete();

                }

            },

            /**
             * Called when moved to complete.
             * @returns {Boolean} true when move is completed, otherwise is continuing sequence.
             **/
            moveToComplete: function () {

                // continue sequence

                if (this.movingToSequence) {

                    this.moveToSequenceNext();

                }
                // complete
                else {

                    this.movedTo = true;

                    // end move to if only moving to once

                    if (this.movingToOnce) {

                        this.moveToStop();
                        this.onMovedTo.dispatch(this);

                    }

                    return true;

                }

            },

            /**
             * Ends any moveTo in progress.
             **/
            moveToStop: function () {

                if (this.movingTo) {

                    if (this.movingToTweening) {

                        this.tweenEnd("movingTo");

                        this.movingToTweenPct = this.movingToTweenX = this.movingToTweenY = 0;

                    }

                    this.movedTo = this.movingToTweening = this.movingToOnce = false;
                    this.movingTo = this.movingToSettings = this.movingToSequence = undefined;


                }

            },

            /**
             * Flips entity to face a target entity or position.
             * @param {ig.EntityExtended|Vector2|Object} target target to look at.
             **/
            lookAt: function (target) {

                // target is not self and not fixed

                if (target && this !== target && !target.fixed) {

                    var centerX = this.pos.x + this.size.x * 0.5;
                    var centerY;
                    var targetCenterX;
                    var targetCenterY;

                    if (_c.TOP_DOWN) {
						
						centerY = this.pos.y + this.size.y * 0.5;

						if ( target instanceof ig.EntityExtended ) {
							
							targetCenterX = target.pos.x + target.size.x * 0.5;
                            targetCenterY = target.pos.y + target.size.y * 0.5;

						}
						else {

							targetCenterX = target.x;  
							targetCenterY = target.y;  

						}

                        var xDiff = centerX - targetCenterX;
                        var yDiff = centerY - targetCenterY;
						
                        if (Math.abs(xDiff) > Math.abs(yDiff)) {
							
							this.facing.y = 0;
							
							if ( xDiff > 0 ) {
								
								this.flip.x = this.canFlipX;
								this.facing.x = -1;
								
							}
							else {
								
								this.flip.x = false;
								this.facing.x = 1;
								
							}

                        }
                        else {
							
							this.facing.x = 0;
							
							if ( yDiff > 0 ) {
								
								this.flip.y = this.canFlipY;
								this.facing.y = -1;
								
							}
							else {
								
								this.flip.y = false;
								this.facing.y = 1;
								
							}
							
                        }

                    }
                    else {

						if ( target instanceof ig.EntityExtended ) {
							
							targetCenterX = target.pos.x + target.size.x * 0.5;

						}
						else {

							targetCenterX = target.x;  

						}
						
						if ( centerX > targetCenterX ) {
							
							this.flip.x = this.canFlipX;
							this.facing.x = -1;
							
						}
						else {
							
							this.flip.x = false;
							this.facing.x = 1;
							
						}
						
                    }

                }

            },

            /**
             * Does damage to entity while checking if invulnerable.
             * @param {Number} amount amount of damage.
             * @param {ig.EntityExtended} [from] entity causing damage.
             * @param {Boolean} [unblockable] whether damage cannot be blocked.
             * @returns {Boolean} whether damage was applied.
             **/
            receiveDamage: function (amount, from, unblockable) {

                // check if invulnerable

                if (( !this.invulnerable || unblockable ) && amount) {

                    this.health -= amount;

                    if (this.health <= 0) {

                        this.kill();

                    }

                    return true;

                }

                // nothing happened

                return false;

            },

            /**
             * Pauses entity.
             */
            pause: function () {

                if (!this.paused) {

                    this.paused = true;

                    // animations

                    for (var animName in this.anims) {

                        var anim = this.anims[ animName ];

                        if (anim) {

                            anim.timer.pause();

                        }

                    }

                    this.onPaused.dispatch(this);

                }

            },

            /**
             * Unpauses entity.
             */
            unpause: function () {

                if (this.paused) {

                    this.paused = false;

                    // animations

                    for (var animName in this.anims) {

                        var anim = this.anims[ animName ];

                        if (anim) {

                            anim.timer.unpause();

                        }

                    }

                    // tweens


                    this.onUnpaused.dispatch(this);

                }

            },

            /**
             * Links entity to another entity, making original refresh after the entity it is linked to.
             * <span class="alert alert-info"><strong>Tip:</strong> this allows for entity chaining and pseudo parent/child transforms.</span>
             * @param {ig.EntityExtended} entity to link to.
             * @param {Boolean} [refresh=true] whether to refresh after linking.
             **/
            link: function (entity, refresh) {

                if (entity !== this) {

                    // remove previous

                    this.unlink(false);

                    // setup new

                    this.linkedTo = entity;

                    // swap listen to game refresh with listen to linked refresh

                    if ( this.linkedTo ) {

                        ig.system.onResized.remove(this.refresh, this);
                        this.linkedTo.onRefreshed.add(this.refresh, this);
                        this.linkedTo.onRemoved.add(this.unlink, this);

                    }

                    // refresh self

                    if (refresh !== false) {

                        this.refresh(true);

                    }

                }

            },

            /**
             * Unlinks entity from whatever it was linked to.
             * @param {Boolean} [refresh=true] whether to refresh after unlinking.
             **/
            unlink: function (refresh) {

                if (this.linkedTo) {

                    this.linkedTo.onRefreshed.remove(this.refresh, this);
                    this.linkedTo.onRemoved.remove(this.unlink, this);
                    ig.system.onResized.add(this.refresh, this);

                }

                // refresh self

                if (refresh !== false) {

                    this.refresh(true);

                }

            },

            /**
             * Kills entity and shows optional effects, animation, etc.
             * <br>- this is not the same as {@link ig.GameExtended#removeEntity}
             * @param {Boolean} [silent] whether to die without effects or animation.
             * @see ig.Entity.
             */
            kill: function (silent) {

                if (!this.dieing) {

                    this.dieing = true;
                    this.dieingSilently = silent || false;

                    // try to show death

                    if (!silent) {
						
						// try to guess death animation name
						
						var animNameDeath = this.getDirectionalAnimName( "death" );
						
						if ( this.anims[ animNameDeath ] ) {

							// flag as killed

							ig.game.flagAsKilled(this);

							// clear velocity

							_utv2.zero(this.vel);

							// play death animation and then die
							
							return this.animOverride( animNameDeath, {
								callback: this.die
							});
							
						}

                    }
					
					// die instantly
					
					this.die();

                }

            },

            /**
             * Automatically called after entity finished being killed.
             * <span class="alert"><strong>IMPORTANT:</strong> for full animated death, use {@link ig.EntityExtended#kill} instead.</span>
             */
            die: function () {
				
				this.currentAnim = null;
				
                ig.game.removeEntity(this);

            },

            /**
             * Does cleanup on entity as it is added to deferred removal list.
             **/
            cleanup: function () {

                // tweens

                this.tweenEnd();

                // stop moving to

                this.moveToStop();

                // unlink

                this.unlink(false);

                // signals

                this.onRemoved.dispatch(this);
                ig.system.onResized.remove(this.refresh, this);

                // clean signals when game has no level

                if ( !ig.game.hasLevel ) {

                    this.onAdded.removeAll();
                    this.onAdded.forget();
                    this.onRemoved.removeAll();
                    this.onRemoved.forget();
                    this.onPaused.removeAll();
                    this.onPaused.forget();
                    this.onUnpaused.removeAll();
                    this.onUnpaused.forget();
                    this.onMovedTo.removeAll();
                    this.onMovedTo.forget();
                    this.onRefreshed.removeAll();
                    this.onRefreshed.forget();

                    for ( var animName in this.anims ) {

                        var anim = this.anims[ animName ];

                        anim.onCompleted.removeAll();
                        anim.onCompleted.forget();

                    }

                }

            },

            /**
             * Called when two entities intersect, regardless of collides and before checks or collisions.
             * @param {ig.EntityExtended} entity entity intersecting.
             **/
            intersectWith: function (entity) {
            },

            /**
             * Checks this entity against another entity that matches this entity's {@link ig.EntityExtended#type}.
             * @param {ig.EntityExtended} [entity] other entity.
             * @see ig.Entity.
             **/
            check: function (entity) {

                this.checking = true;
                this._stopChecking = false;

            },

            /**
             * Automatcially called on update after done checking against all entities to flag entity as no longer checking.
             **/
            checkStop: function () {

                this.checking = this._stopChecking = false;

            },

            /**
             * Collides with another entity along a specified axis.
             * @param {ig.EntityExtended} entity entity colliding with.
             * @param {Number} dirX horizontal direction of colliding entity
             * @param {Number} dirY vertical direction of colliding entity
             * @param {Number} nudge nudge amount in direction
             * @param {Number} vel velocity in direction
             * @param {Boolean} weak weak colliding entity (i.e. only weak moves)
             */
            collideWith: function (entity, dirX, dirY, nudge, vel, weak) {

                var res;

                if ( weak ) {

                    if ( this === weak ) {

                        // horizontal separation

                        if ( dirX !== 0 ) {

                            this.vel.x = -this.vel.x * this.bounciness + entity.vel.x;

                            res = ig.game.collisionMap.trace( this.pos.x, this.pos.y, nudge, 0, this.size.x, this.size.y );

                        }
                        // vertical separation
                        else {

                            this.vel.y = -this.vel.y * this.bounciness + entity.vel.y;

                            // on a moving entity that collides fixed (ex: platform)

                            var nudgeX = 0;

                            if( entity.collides === ig.EntityExtended.COLLIDES.FIXED && dirY > 0 && Math.abs(this.vel.y - entity.vel.y) < this.minBounceVelocity ) {

                                this.standing = this.grounded = true;
                                nudgeX = entity.vel.x * ig.system.tick;

                            }

                            res = ig.game.collisionMap.trace( this.pos.x, this.pos.y, nudgeX, nudge, this.size.x, this.size.y );

                        }

                        // record changes and check bounds to account for collision if this was not strong in the collision
                        // because collision will likely only change positions, check for position change here instead of in record changes
                        // record changes tends to check more than just position, which in this case is unnecessary

                        if ( res.pos.x !== this.pos.x || res.pos.y !== this.pos.y ) {
							
							this.pos.x = res.pos.x;
							this.pos.y = res.pos.y;

                            this.recordChanges(true);

                        }

                    }

                }
                else {

                    // horizontal separation

                    if ( dirX !== 0 ) {

                        this.vel.x = vel;

                        res = ig.game.collisionMap.trace( this.pos.x, this.pos.y, nudge * 0.5, 0, this.size.x, this.size.y );

                    }
                    // vertical separation
                    else {

                        var unfair;
                        var nudgeX;

                        if ( dirY > 0 ) {

                            nudgeX = entity.collides === ig.EntityExtended.COLLIDES.FIXED && entity.vel.x * ig.system.tick;
                            unfair = entity.grounded;

                        }
                        else {

                            if ( this.grounded ) {

                                return;

                            }

                            nudgeX = 0;

                        }

                        // unfair collision
                        // only this should be moved

                        if ( unfair ) {

                            res = ig.game.collisionMap.trace( this.pos.x, this.pos.y, nudgeX, nudge, this.size.x, this.size.y );

                            if( this.bounciness > 0 && this.vel.y > this.minBounceVelocity ) {

                                this.vel.y *= -this.bounciness;

                            }
                            else {

                                this.standing = this.grounded = true;
                                this.vel.y = 0;

                            }

                        }
                        else {

                            this.vel.y = vel;
                            this.standing = this.grounded = true;

                            res = ig.game.collisionMap.trace( this.pos.x, this.pos.y, nudgeX, nudge * 0.5, this.size.x, this.size.y );

                        }

                    }

                    // record changes and check bounds to account for collision if this was not strong in the collision
                    // because collision will likely only change positions, check for position change here instead of in record changes
                    // record changes tends to check more than just position, which in this case is unnecessary

                    if ( res && ( res.pos.x !== this.pos.x || res.pos.y !== this.pos.y ) ) {
					
						this.pos.x = res.pos.x;
						this.pos.y = res.pos.y;
						
                        this.recordChanges(true);

                    }

                }

            },

            /**
             * Enhanced handling of results of collision with collision map.
             * @override
             * @example
             * // generally, climbable tiles are IGNORED
             * // if we need them we should be using game's shapesPasses
             * myGame.shapesPasses = [
             *      {
             *          ignoreSolids: true,
             *          ignoreOneWays: true
             *      }
             * ]
             * // this is because movement trace only catches collisions
             * // and it does not record the tile(s) this entity is within
             * // but the above shapes passes will extract climbable shapes
             * // and create entities of them, so we can know when
             * // one entity is within another entity that is climbable
             */
            handleMovementTrace: function( res ) {

                if ( !( this.gravityFactor === 0 || ig.game.gravity === 0 ) ) {

                    this.standing = false;

                    if (this.vel.y !== 0) {

                        this.grounded = false;

                    }

                }
				
				this.collidingWithMap = false;

                if ( res.tile.x && _utt.isTileClimbable( res.tile.x ) ) {

                    res.pos.x = this.pos.x + this.vel.x * ig.system.tick;

                }
                else if (res.collision.x) {
					
					this.collidingWithMap = true;

                    if (this.bounciness > 0 && Math.abs(this.vel.x) > this.minBounceVelocity) {
                        this.vel.x *= -this.bounciness;
                    }
                    else {
                        this.vel.x = 0;
                    }

                }

                if ( res.tile.y && _utt.isTileClimbable( res.tile.y ) && ( this._climbingIntentDown || this._climbingIntentUp ) ) {

                    res.pos.y = this.pos.y + this.vel.y * ig.system.tick;
                    res.collision.slope = false;

                }
                else if (res.collision.y) {
					
					this.collidingWithMap = true;

                    if (this.bounciness > 0 && Math.abs(this.vel.y) > this.minBounceVelocity) {
                        this.vel.y *= -this.bounciness;
                    }
                    else {
                        if (this.vel.y > 0) {
                            this.standing = this.grounded = true;
                        }
                        this.vel.y = 0;

                    }

                }

                var s = res.collision.slope;

                if (s) {

                    this.slope = s;
                    this.collidingWithMap = true;

                    s.angle = Math.atan2(s.ny, s.nx);

                    if (s.angle > this.slopeStanding.min && s.angle < this.slopeStanding.max ) {

                        this.standing = this.grounded = true;

                        // add a bit of force upwards if moving up a slope, based on slope angle
                        // ideally we would just rotate the velocity itself to run with the slope but that breaks the collision tracing

                        if (s.nx * this.vel.x < 0) {

                            this.vel.y = -Math.abs(( s.angle + _utm.HALFPI ) * this.vel.x) * this.slopeSpeedMod;

                        }

                    }

                }
                else {

                    this.slope = false;

                }

                // check if can use result position

                if (!( this.slope && this.grounded && this.vel.x === 0 )) {

                    this.pos.x = res.pos.x;
                    this.pos.y = res.pos.y;

                }

            },

            /**
             * Updates entity.
             * <br>- all update parts are now opt-in through (@link ig.EntityExtended#frozen} and (@link ig.EntityExtended#performance}
             * <br>- paused entities don't update at all
             * <br>- frozen entities don't update except to do (@link ig.EntityExtended#updateCleanup} (useful for triggers)
             * <br>- static performance entities only check if visible and do (@link ig.EntityExtended#updateVisible}
             * <br>- movable performance entities ignore collision map but do move and check for changes via (@link ig.EntityExtended#updateChanges} and (@link ig.EntityExtended#recordChanges}
             * <br>- dynamic performance entities move, check for changes, collide with collision map, and have physics forces via (@link ig.EntityExtended#updateVelocity}
             * <span class="alert"><strong>IMPORTANT:</strong> (@link ig.EntityExtended#performance} has nothing to do with entity to entity collisions, which is defined by (@link ig.EntityExtended#collides}.</span>
             **/
            update: function () {

                if (!this.paused) {

                    // unfrozen entities, i.e. do more on update than just checks

                    if (!this.frozen) {

                        // static entities, i.e. never moving

                        if (this.performance === _c.STATIC) {

                            if (this._changedAdd && this.changed) {

                                this.updateBounds();
                                this.changed = false;

                            }

                        }
                        // movable or moving entities
                        else {

                            if ( this.controllable ) {

                                this.updateChanges();

                            }

                            // dynamic entities

                            if (this.performance === _c.DYNAMIC && !this._killed) {
							
								this.updateDynamics();

                            }

                            this.recordChanges();

                            // record last at end
                            // allows for external changes to entity

                            this.recordLast();

                        }

                        // visibility

                        this.visible = this.getIsVisible();

                        if (this.visible) {

                            this.updateVisible();

                        }
                        else {

                            // when dieing and not visible, die instantly

                            if (this.dieing) {

                                this.die();

                            }

                        }

                    }

                    this.updateCleanup();

                }
                // check visible when paused but camera is not
                else if ( ig.game.camera && !ig.game.camera.paused ) {

                    this.visible = this.getIsVisible();

                }

            },

            /**
             * Handles clean up of update for entity including checking status.
             * <br>- called automatically by {@link ig.EntityExtended#update}
             * <br>- useful for setting / resetting properties that are set after update (i.e. during collision checks).
             */
            updateCleanup: function () {

                // checking, stop on next update

                if (this.checking && !this._layerChange) {

                    // attempt to stop checking

                    if (this._stopChecking) {

                        this.checkStop();

                    }
                    else {

                        this._stopChecking = true;

                    }

                }

            },

            /**
             * Records last transform.
             * <br>- called automatically by {@link ig.EntityExtended#update}
             **/
            recordLast: function () {
				
                _utv2.copy(this.last, this.pos);
                this._angleLast = this.angle;

            },

            /**
             * Records limited changes in transform and sets {@link ig.EntityExtended#changed} and {@link ig.EntityExtended#moving}.
             * <br>- called automatically by {@link ig.EntityExtended#update}
             * @param {Boolean} [force] forces changed.
             **/
            recordChanges: function (force) {

                if (force === true
                    || this.pos.x !== this.last.x
                    || this.pos.y !== this.last.y
                    || this.angle !== this._angleLast) {

                    this.changed = true;
					
					if ( this.vel.x !== 0 ) {

						this.movingX = true;
						
						if ( this.vel.x < 0 ) {
							
							this.flip.x = this.canFlipX;
						
						}
						else {
							
							this.flip.x = false;
							
						}
						
					}
					else {

						this.movingX = false;

					}
					
					if ( this.vel.y !== 0 ) {

						this.movingY = true;
						
						// y facing
						
						if ( _c.TOP_DOWN || this.canFlipY ) {
							
							if ( this.vel.y < 0 ) {
								
								this.flip.y = this.canFlipY;
							
							}
							else {
								
								this.flip.y = false;
								
							}
							
						}
						
					}
					else {

						this.movingY = false;
						
					}
					
                    this.moving = this.movingX || this.movingY;
						
					this.updateBounds();
					
                }
                else {

                    this.changed = this.moving = this.movingX = this.movingY = false;

                }

            },

            /**
             * Updates bounds.
             * <br>- called automatically by {@link ig.EntityExtended#recordChanges} when {@link ig.EntityExtended#needsBounds}
             **/
            updateBounds: function () {
					
				this.posDraw.x = this.getPosDrawX();
				this.posDraw.y = this.getPosDrawY();

                if (this.needsVertices) {

                    this._verticesFound = true;
                    this.verticesWorld = this.getVerticesWorld();

                }
                else {

                    this._verticesFound = false;

                }
				
				if ( this.needsBounds ) {
					
					this.getBounds();
					this.getBoundsDraw();
					
				}

            },

            /**
             * Changes entity.
             * <br>- called automatically by {@link ig.EntityExtended#update}
             * <span class="alert alert-info"><strong>Tip:</strong> use this method to handle moving, acting, etc, instead of the main update method.</span>
             **/
            updateChanges: function () {

                this.moveToUpdate();

            },

            /**
             * Updates dynamic properties such as velocity, gravity, collisions with collision map, etc.
             * <br>- called automatically by {@link ig.EntityExtended#update}
			 * <span class="alert"><strong>IMPORTANT:</strong> if you change the way bounds are calculated you will also need to override the updateDynamics method!</span>
             **/
			updateDynamics: function () {

				this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;

				this.updateVelocity();
				
				var mx = this.vel.x * ig.system.tick;
				var my = this.vel.y * ig.system.tick;
				
				var res = ig.game.collisionMap.trace(
					this.pos.x, this.pos.y,
					mx, my, 
					this.size.x, this.size.y
				);
				
				this.handleMovementTrace(res);
				
			},

            /**
             * Updates velocity based on acceleration and friction.
             * <br>- called automatically by {@link ig.EntityExtended#updateDynamics}
             **/
            updateVelocity: function () {

                this.vel.x = this.getNewVelocity(this.vel.x, this.accel.x, this.friction.x, this.maxVel.x);
                this.vel.y = this.getNewVelocity(this.vel.y, this.accel.y, this.friction.y, this.maxVel.y);

            },

            /**
             * Called when visible to update animations.
             * <br>- called automatically by {@link ig.EntityExtended#update}
             **/
            updateVisible: function () {

                // ensure current animation is overridden

                if (this.overridingAnim && this.currentAnim !== this.overridingAnim) {

                    // store current to be restored when anim released

                    this._overridedAnim = this.currentAnim;
                    this.currentAnim = this.overridingAnim;

                }

                // update animation

                if (this.currentAnim) {

                    this.currentAnim.update();

                }

                // reset _changedAdd when visible only
                // this can help to avoid heavy start-up costs
                // as an entity will remain changed until it is visible

                if (this._changedAdd) {

                    this._changedAdd = false;
                    this.updateBounds();

                }


            },

            /**
             * Draws entity.
             **/
            draw: function () {

                if (this.currentAnim && this.visible) {

                    var minX = this.posDraw.x;
                    var minY = this.posDraw.y;

                    // temporarily swap properties

                    var alpha = this.currentAnim.alpha;

                    this.currentAnim.alpha *= this.alpha;
					
                    // set flip
                    this.currentAnim.flip = this.flip;

                    var angle;

                    if ( this.angle !== 0 ) {

                        angle = this.currentAnim.angle;
                        this.currentAnim.angle = this.angle;
                        minX += ( this.sizeDraw.x - this.currentAnim.sheet.width ) * 0.5;
                        minY += ( this.sizeDraw.y - this.currentAnim.sheet.height ) * 0.5;

                    }

                    // fixed in screen

                    if (this.fixed) {

                        this.currentAnim.draw(
                            minX,
                            minY,
                            this.scale,
                            this.textured ? this : undefined
                        );

                    }
                    // default draw
                    else {

                        // original entity draw uses ig.game._rscreen, which seems to cause drawing to jitter
                        // ig.game.screen is much more accurate

                        this.currentAnim.draw(
                            minX - ig.game.screen.x,
                            minY - ig.game.screen.y,
                            this.scale,
                            this.textured ? this : undefined
                        );

                    }

                    // restore properties

                    this.currentAnim.alpha = alpha;

                    if ( this.angle !== 0 ) {

                        this.currentAnim.angle = angle;

                    }

                }

            }

        });

        /**
         * Bitwise flags for entities that check against other entities of a specific type.
         * <br>- this integrates the previous type system, so it can be used safely in its place
         * <br>- some flags are already defined for convenience
         * <br>- up to 32 flags can be defined
         * <span class="alert alert-info"><strong>Tip:</strong> any class can have it's own TYPE flags! Ex: Abilities have their own set of TYPE flags at {@link ig.Ability.TYPE}</span>
         * @static
         * @readonly
         * @memberof ig.EntityExtended
         * @namespace ig.EntityExtended.TYPE
         * @see ig.utils.getType
         * @see ig.utils.addType
         **/
        ig.EntityExtended.TYPE = ( function () {

            var types = [];
            var combinationTypes = [];
            var name;
            var flag;

            // get all existing types

            for ( name in ig.Entity.TYPE ) {

                types.push( {
                    name: name,
                    flag: ig.Entity.TYPE[ name ]
                } );

            }

            // sort types by lowest flag up

            types.sort( function ( a, b ) {

                return a.flag - b.flag;

            });

            // add types that are a power of 2

            for ( var i = 0, il = types.length; i < il; i++ ) {

                var type = types[ i ];
                name = type.name;
                flag = type.flag;

                // flag that is zero or not a power of 2 should be added manually at end

                if ( (flag === 0) || ( ( flag & ( flag - 1) ) !== 0) ) {

                    combinationTypes.push( type );

                }
                else {

                    _ut.getType(ig.EntityExtended, name);

                }

            }

            // add combination types

            for ( var i = 0, il = combinationTypes.length; i < il; i++ ) {

                var type = combinationTypes[ i ];
                name = type.name;
                flag = type.flag;

                ig.EntityExtended.TYPE[ name ] = flag;

            }

            return ig.EntityExtended.TYPE;

        })();

        /**
         * NONE type flag.
         * @memberof ig.EntityExtended.TYPE
         * @type Bitflag
         **/
        ig.EntityExtended.TYPE.NONE;

        /**
         * A type flag.
         * @memberof ig.EntityExtended.TYPE
         * @type Bitflag
         **/
        ig.EntityExtended.TYPE.A;

        /**
         * B type flag.
         * @memberof ig.EntityExtended.TYPE
         * @type Bitflag
         **/
        ig.EntityExtended.TYPE.B;

        /**
         * BOTH type flag for both A and B types.
         * @memberof ig.EntityExtended.TYPE
         * @type Bitflag
         **/
        ig.EntityExtended.TYPE.BOTH;

        _ut.getType(ig.EntityExtended, "INTERACTIVE");
        /**
         * INTERACTIVE type flag.
         * @memberof ig.EntityExtended.TYPE
         * @type Bitflag
         **/
        ig.EntityExtended.TYPE.INTERACTIVE;

        _ut.getType(ig.EntityExtended, "DAMAGEABLE");
        /**
         * DAMAGEABLE type flag.
         * @memberof ig.EntityExtended.TYPE
         * @type Bitflag
         **/
        ig.EntityExtended.TYPE.DAMAGEABLE;

        _ut.getType(ig.EntityExtended, "DANGEROUS");
        /**
         * DANGEROUS type flag.
		 * <span class="alert alert-info"><strong>Tip:</strong> assign this type to any entity that may hurt, debuff, or kill other entities for better pathfinding!</span>
         * @memberof ig.EntityExtended.TYPE
         * @type Bitflag
         **/
        ig.EntityExtended.TYPE.DANGEROUS;

        /**
         * Bitwise flags for entities that do not collide or check against each other, via {@link ig.EntityExtended#group}.
         * <br>- some flags are already defined for convenience
         * <br>- up to 32 flags can be defined
         * <span class="alert alert-info"><strong>Tip:</strong> any class can have it's own GROUP flags!</span>
         * @static
         * @readonly
         * @memberof ig.EntityExtended
         * @namespace ig.EntityExtended.GROUP
         * @see ig.utils.getType
         * @see ig.utils.addType
         **/
        ig.EntityExtended.GROUP = {};

        /**
         * NONE group flag.
         * @memberof ig.EntityExtended.GROUP
         * @type Bitflag
         **/
        ig.EntityExtended.GROUP.NONE = 0;

        _ut.getType(ig.EntityExtended, "FRIEND", "GROUP");
        /**
         * FRIEND group flag.
         * @memberof ig.EntityExtended.GROUP
         * @type Bitflag
         **/
        ig.EntityExtended.GROUP.FRIEND;

        _ut.getType(ig.EntityExtended, "ENEMY", "GROUP");
        /**
         * ENEMY type flag.
         * @memberof ig.EntityExtended.GROUP
         * @type Bitflag
         **/
        ig.EntityExtended.GROUP.ENEMY;

        /**
         * Collision types for entities that do not collide or check against each other, via {@link ig.EntityExtended#collides}.
         * <span class="alert alert-info"><strong>Tip:</strong> these are NOT bitwise flags!</span>
         * @static
         * @readonly
         * @memberof ig.EntityExtended
         * @namespace ig.EntityExtended.COLLIDES
         **/
        ig.EntityExtended.COLLIDES = ig.merge( {}, ig.Entity.COLLIDES );

        /**
         * DOUBLE FIXED collision.
         * @type Number
         * @memberof ig.EntityExtended.COLLIDES
         **/
        ig.EntityExtended.COLLIDES.DOUBLEFIXED = ig.EntityExtended.COLLIDES.FIXED + ig.EntityExtended.COLLIDES.FIXED;

        var COLLISION_ACTIVE = ig.EntityExtended.COLLIDES.ACTIVE;
        var COLLISION_DOUBLEFIXED = ig.EntityExtended.COLLIDES.DOUBLEFIXED;

        /**
         * Expanded pair checking to handle groups and one-way.
         * @static
         */
        ig.EntityExtended.checkPair = function (a, b) {

            // always intersect

            a.intersectWith(b);
            b.intersectWith(a);

            // entities in same group never check or collide

            if (( a.group & b.group ) === 0) {

                // check entities against each other as needed

                if (a.checkAgainst & b.type) {

                    a.check(b);

                }

                if (b.checkAgainst & a.type) {

                    b.check(a);

                }

                // solve collision if
                // at least one entity collides ACTIVE or FIXED
                // and the other does not collide NEVER
                // also ensure neither entity is one way
                // or if they are that the other is colliding from one way blocking direction

                if (a.collides + b.collides > COLLISION_ACTIVE
                    && ( !a.oneWay || b.getIsCollidingWithOneWay(a) )
                    && ( !b.oneWay || a.getIsCollidingWithOneWay(b) ) ) {

                    ig.EntityExtended.solveCollision(a, b);

                }

            }

        };

        /**
         * Expanded collision solving to ensure stable entity bounds.
         * @static
         */
        ig.EntityExtended.solveCollision = function (a, b) {

            // find weaker entity of the pair to move
            // FIXED > ALL and ACTIVE > LITE and ACTIVE = PASSIVE
            // PASSIVE can be used to allow entities to pass through each other
            // but PASSIVE is mostly unnecessary as groups (@see ig.Entity.checkPair) do the job much more precisely

            var weak = null;

            if ( a.collides === ig.EntityExtended.COLLIDES.LITE
                || b.collides === ig.EntityExtended.COLLIDES.FIXED ) {

                weak = a;

            }
            else if ( b.collides === ig.EntityExtended.COLLIDES.LITE
                || a.collides === ig.EntityExtended.COLLIDES.FIXED ) {

                weak = b;

            }

            // check overlap amount on each axis and do solve collisions on the axis with the lowest overlap
            // this changes the previous behavior which sometimes preferred vertical collisions incorrectly over horizontal collisions

            var top;
            var bottom;
            var left;
            var right;
            var overlapX;
            var overlapY;

            if (a.pos.x < b.pos.x) {

                left = a;
                right = b;
                overlapX = a.pos.x + a.size.x - b.pos.x;

            }
            else {

                left = b;
                right = a;
                overlapX = b.pos.x + b.size.x - a.pos.x;

            }

            if (a.pos.y < b.pos.y) {

                top = a;
                bottom = b;
                overlapY = a.pos.y + a.size.y - b.pos.y;

            }
            else {

                top = b;
                bottom = a;
                overlapY = b.pos.y + b.size.y - a.pos.y;

            }
			
            var vel;

            // higher overlap on y axis, i.e. horizontal collision

            if (overlapY > overlapX) {

                // two fixed entities collided

                if ( left.collides + right.collides >= COLLISION_DOUBLEFIXED ) {

                    left.collideWith(right, 1, 0, -overlapX, 0);
                    right.collideWith(left, -1, 0, overlapX, 0);

                }
                else {

                    vel = (left.vel.x - right.vel.x) * 0.5;

                    left.collideWith(right, 1, 0, -overlapX, -vel, weak);
                    right.collideWith(left, -1, 0, overlapX, vel, weak);

                }

            }
            // default to higher overlap on x axis, i.e. vertical collision
            else {

                // two fixed entities collided

                if ( top.collides + bottom.collides >= COLLISION_DOUBLEFIXED ) {

                    top.collideWith(bottom, 0, 1, -overlapY, 0);
                    bottom.collideWith(top, 0, -1, overlapY, 0);

                }
                else {

                    vel = (top.vel.y - bottom.vel.y) * 0.5;

                    top.collideWith(bottom, 0, 1, -overlapY, -vel, weak);
                    bottom.collideWith(top, 0, -1, overlapY, vel, weak);

                }

            }

        };

        /*
         * overrides and fixes for when in editor
         */
        if (ig.global.wm) {

            delete ig.EntityExtended.prototype.staticInstantiate;

            ig.EntityExtended.inject({

                visible: true,

                touches: function ( selector ) {

                    return _uti.pointInAABB(
						selector.pos.x, selector.pos.y,
						this.pos.x, this.pos.y, this.pos.x + this.size.x, this.pos.y + this.size.y
					);

                },

                draw: function () {

                    // force changed and recalculation of bounds

                    this.refresh(true);

                    // update visible no matter what

                    this.updateVisible();

                    // double check textures

                    if ( this.textured ) {

                        for ( var name in this.anims ) {

                            this.anims[ name ].texturize( this );

                        }

                    }

                    this.parent();

                }

            });

        }

    });