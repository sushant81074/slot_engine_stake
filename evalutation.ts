import { type GameContext, SPIN_TYPE } from "@slot-engine/core";
import { type UserStateType } from "./index";

/**
 * If Free Spins were upgraded to Super Free Spins,
 * slightly favor Super Free Spins reel set
 */
export function superFreespinsReelsEvaluation(
    ctx: GameContext<any, any, UserStateType>,
) {
    if (ctx.state.userData.freespinsUpgradedToSuper) {
        return {
            bonus2: 1, // super free spins reels
        };
    }
}

/**
 * Hard MaxWin forcing
 * (used only when ResultSet has forceMaxWin = true)
 */
export function maxwinReelsEvaluation(
    ctx: GameContext<any, any, UserStateType>,
) {
    if (ctx.state.currentResultSet?.forceMaxWin) {
        return {
            bonus2: 1, // maxwin-compatible reel set
        };
    }
}

/**
 * Upgrade path:
 * If Free Spins are being upgraded AND Super Free Spins were triggered,
 * increase probability of MaxWin reels
 */
export function upgradeIntoMaxwinReelsEvaluation(
    ctx: GameContext<any, any, UserStateType>,
) {
    if (
        ctx.state.userData.freespinsUpgradedToSuper &&
        ctx.state.userData.triggeredSuperFreespins
    ) {
        return {
            bonus1: 3,
            bonus2: 1,
        };
    }
}

/**
 * Free Spins → Super Free Spins upgrade evaluation
 * (controls upgrade state only, not reel weights)
 */

export function freeSpinsUpgradeEvaluation(
    ctx: GameContext<any, any, UserStateType>,
): boolean {
    return (
        ctx.state.currentSpinType === SPIN_TYPE.FREE_SPINS &&
        Boolean(ctx.state.currentResultSet?.userData?.upgradeFreespins)
    );
}