import {
    type GameContext,
    GameSymbol,
    SPIN_TYPE,
} from "@slot-engine/core"
import type { GameModesType, SymbolsType, UserStateType } from "./index"

type Context = GameContext<GameModesType, SymbolsType, UserStateType>

export function onHandleGameFlow(ctx: Context) {
    const payout = spin(ctx)
    ctx.services.wallet.addSpinWin(payout)
    ctx.services.wallet.confirmSpinWin()
}

function spin(ctx: Context): number {
    drawBoard(ctx)

    const reel = ctx.services.board.getBoardReels()[1] // ONLY middle reel
    let payout = reelToNumber(reel)

    payout = applyMaxCap(payout)

    const special = getSpecialWheelResult(ctx)

    switch (special) {
        case "RE_SPIN":
            payout += spin(ctx)
            break

        case "2X":
            payout *= 2
            break

        case "5X":
            payout *= 5
            break

        case "10X":
            payout *= 10
            break

        case "SCATTER_G":
        case "SCATTER_R":
            payout += getLuckyWheelResult(ctx)
            break

        case "-1":
        default:
            break
    }

    return payout
}

/**
 * DRAW NUMBER BOARD
 */
function drawBoard(ctx: Context) {
    const reels = ctx.services.board.getRandomReelset()
    ctx.services.board.resetBoard()
    ctx.services.board.drawBoardWithRandomStops(reels)
}

/**
 * CONVERT SYMBOLS → NUMBER
 */
function reelToNumber(reel: GameSymbol[]): number {
    const value = Number(
        reel
            .filter(sym => sym.id !== "BLANK")
            .map(sym => sym.id.replace("N", ""))
            .join("")
    )

    return Number.isNaN(value) ? 0 : value
}

/**
 * MAX CAP GUARD
 */
function applyMaxCap(value: number): number {
    const MAX_CAP = 1055
    return Math.min(value, MAX_CAP)
}

/**
 * SPECIAL WHEEL
 */
function getSpecialWheelResult(ctx: Context) {
    const SPECIAL_WHEEL = {
        "-1": 75,
        RE_SPIN: 10,
        "2X": 5,
        "5X": 3,
        "10X": 2,
        SCATTER_G: 3,
        SCATTER_R: 2,
    }

    return ctx.services.rng.weightedRandom(SPECIAL_WHEEL)
}

/**
 * LUCKY WHEEL
 */
function getLuckyWheelResult(ctx: Context): number {
    const LUCKY_WHEEL = {
        50: 10,
        100: 15,
        150: 10,
        200: 15,
        300: 15,
        500: 15,
        1000: 10,
        2000: 10,
    }

    return Number(ctx.services.rng.weightedRandom(LUCKY_WHEEL))
}
