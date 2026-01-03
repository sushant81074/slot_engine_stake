import {
    GameMode,
    GameSymbol,
    OptimizationConditions,
    OptimizationParameters,
    OptimizationScaling,
    ResultSet,
    SPIN_TYPE,
    createSlotGame,
    defineGameModes,
    defineSymbols,
    defineUserState,
    type InferGameType,
} from "@slot-engine/core";

import { GENERATORS } from "./reels";
import { onHandleGameFlow } from "./handleGameFlow";
import { freeSpinsUpgradeEvaluation, maxwinReelsEvaluation, superFreespinsReelsEvaluation, upgradeIntoMaxwinReelsEvaluation } from "./evalutation";

/* -------------------------------------------------------------------------- */
/*                                   USER STATE                               */
/* -------------------------------------------------------------------------- */

export const userState = defineUserState({
    triggeredSuperFreespins: false,
    freespinsUpgradedToSuper: false,
});

export type UserStateType = typeof userState;

/* -------------------------------------------------------------------------- */
/*                                   SYMBOLS                                  */
/* -------------------------------------------------------------------------- */

export const symbols = defineSymbols({
    BLANK: new GameSymbol({ id: "BLANK", properties: { isScatter: false, isSpecialWheelElement: false, }, }),
    N10: new GameSymbol({ id: "N10", properties: { isScatter: false, isSpecialWheelElement: false } }),
    N00: new GameSymbol({ id: "N00", properties: { isScatter: false, isSpecialWheelElement: false } }),
    N5: new GameSymbol({ id: "N5", properties: { isScatter: false, isSpecialWheelElement: false } }),
    N1: new GameSymbol({ id: "N1", properties: { isScatter: false, isSpecialWheelElement: false } }),
    N0: new GameSymbol({ id: "N0", properties: { isScatter: false, isSpecialWheelElement: false } }),

    "2x": new GameSymbol({ id: "2x", properties: { isScatter: false, isSpecialWheelElement: false } }),
    "5x": new GameSymbol({ id: "5x", properties: { isScatter: false, isSpecialWheelElement: false } }),
    "10x": new GameSymbol({ id: "10x", properties: { isScatter: false, isSpecialWheelElement: false } }),

    "ALL_RESPIN": new GameSymbol({ id: "ALL_RESPIN", properties: { isScatter: true, isSpecialWheelElement: false } }),
    "G_SCATTER": new GameSymbol({ id: "G_SCATTER", properties: { isScatter: true, isSpecialWheelElement: false } }),
    "R_SCATTER": new GameSymbol({ id: "R_SCATTER", properties: { isScatter: true, isSpecialWheelElement: false } }),

    "50": new GameSymbol({ id: "50", properties: { isScatter: false, isSpecialWheelElement: true } }),
    "100": new GameSymbol({ id: "100", properties: { isScatter: true, isSpecialWheelElement: true } }),
    "150": new GameSymbol({ id: "150", properties: { isScatter: true, isSpecialWheelElement: true } }),
    "200": new GameSymbol({ id: "200", properties: { isScatter: false, isSpecialWheelElement: true } }),
    "300": new GameSymbol({ id: "300", properties: { isScatter: true, isSpecialWheelElement: true } }),
    "500": new GameSymbol({ id: "500", properties: { isScatter: true, isSpecialWheelElement: true } }),
    "1000": new GameSymbol({ id: "1000", properties: { isScatter: true, isSpecialWheelElement: true } }),
    "2000": new GameSymbol({ id: "2000", properties: { isScatter: false, isSpecialWheelElement: true } }),
});

export type SymbolsType = typeof symbols;

/* -------------------------------------------------------------------------- */
/*                                  GAME MODES                                */
/* -------------------------------------------------------------------------- */

export const gameModes = defineGameModes({
    base: new GameMode({
        name: "base",
        cost: 1,
        rtp: 0.96,
        reelsAmount: 5,
        symbolsPerReel: [3, 3, 3, 3, 3],
        isBonusBuy: false,
        reelSets: Object.values(GENERATORS),

        resultSets: [
            new ResultSet({
                criteria: "0",
                quota: 0.4,
                multiplier: 0,
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 1 },
                },
            }),

            new ResultSet({
                criteria: "basegame",
                quota: 0.4,
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 1 },
                },
            }),

            new ResultSet({
                criteria: "freespins",
                quota: 0.1,
                forceFreespins: true,
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 3, bonus2: 1 },
                },
            }),

            new ResultSet({
                criteria: "freespinsUpgradeToSuper",
                quota: 0.01,
                forceFreespins: true,
                userData: { upgradeFreespins: true },
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 3, bonus2: 1 },
                    evaluate: superFreespinsReelsEvaluation,
                },
                evaluate: freeSpinsUpgradeEvaluation,
            }),

            new ResultSet({
                criteria: "superFreespins",
                quota: 0.01,
                forceFreespins: true,
                userData: { forceSuperFreespins: true },
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 3, bonus2: 1 },
                    evaluate: superFreespinsReelsEvaluation,
                },
            }),

            new ResultSet({
                criteria: "freespinsUpgradeToSuperMaxwin",
                quota: 0.0005,
                forceMaxWin: true,
                forceFreespins: true,
                userData: { upgradeFreespins: true },
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 1, bonus2: 3 },
                    evaluate: upgradeIntoMaxwinReelsEvaluation,
                },
                evaluate: freeSpinsUpgradeEvaluation,
            }),

            new ResultSet({
                criteria: "maxwin",
                quota: 0.0005,
                forceMaxWin: true,
                forceFreespins: true,
                userData: { forceSuperFreespins: true },
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 1, bonus2: 3 },
                    evaluate: maxwinReelsEvaluation,
                },
            }),
        ],
    }),

    bonus: new GameMode({
        name: "bonus",
        cost: 70,
        rtp: 0.96,
        reelsAmount: 5,
        symbolsPerReel: [3, 3, 3, 3, 3],
        isBonusBuy: true,
        reelSets: Object.values(GENERATORS),

        resultSets: [
            new ResultSet({
                criteria: "freespins",
                quota: 0.9,
                forceFreespins: true,
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 3, bonus2: 1 },
                },
            }),

            new ResultSet({
                criteria: "freespinsUpgradeToSuper",
                quota: 0.05,
                forceFreespins: true,
                userData: { upgradeFreespins: true },
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 1, bonus2: 2 },
                    evaluate: superFreespinsReelsEvaluation,
                },
                evaluate: freeSpinsUpgradeEvaluation,
            }),

            new ResultSet({
                criteria: "freespinsUpgradeToSuperMaxwin",
                quota: 0.005,
                forceMaxWin: true,
                forceFreespins: true,
                userData: { upgradeFreespins: true },
                reelWeights: {
                    [SPIN_TYPE.BASE_GAME]: { number_base: 1 },
                    [SPIN_TYPE.FREE_SPINS]: { number_bonus: 1, bonus2: 3 },
                    evaluate: upgradeIntoMaxwinReelsEvaluation,
                },
                evaluate: freeSpinsUpgradeEvaluation,
            }),
        ],
    }),
});

export type GameModesType = typeof gameModes;
export type GameType = InferGameType<GameModesType, SymbolsType, UserStateType>;

/* -------------------------------------------------------------------------- */
/*                                   GAME CORE                                */
/* -------------------------------------------------------------------------- */

export const game = createSlotGame<GameType>({
    id: "golden-freespins",
    name: "Golden Free Spins",
    maxWinX: 2000,

    gameModes,
    symbols,
    userState,
    padSymbols: 1,

    scatterToFreespins: {
        [SPIN_TYPE.BASE_GAME]: { 3: 10, 4: 12, 5: 15 },
        [SPIN_TYPE.FREE_SPINS]: { 3: 6, 4: 8, 5: 10 },
    },

    hooks: {
        onHandleGameFlow,
    },
});

/* -------------------------------------------------------------------------- */
/*                             SIMULATION & OPTIMIZATION                      */
/* -------------------------------------------------------------------------- */

game.configureSimulation({
    simRunsAmount: { base: 10000, bonus: 10000 },
    concurrency: 8,
});

game.configureOptimization({
    gameModes: {
        base: {
            conditions: {
                freespinsUpgradeToSuperMaxwin: new OptimizationConditions({
                    rtp: 0.002,
                    avgWin: 2000,
                    searchConditions: { criteria: "freespinsUpgradeToSuperMaxwin" },
                    priority: 10,
                }),
                maxwin: new OptimizationConditions({
                    rtp: 0.008,
                    avgWin: 2000,
                    searchConditions: { criteria: "maxwin" },
                    priority: 8,
                }),
                "0": new OptimizationConditions({
                    rtp: 0,
                    avgWin: 0,
                    searchConditions: 0,
                    priority: 6,
                }),
                freespinsUpgradeToSuper: new OptimizationConditions({
                    rtp: 0.03,
                    hitRate: 500,
                    searchConditions: { criteria: "freespinsUpgradeToSuper" },
                    priority: 4,
                }),
                superFreespins: new OptimizationConditions({
                    rtp: 0.02,
                    hitRate: 500,
                    searchConditions: { criteria: "superFreespins" },
                    priority: 3,
                }),
                freespins: new OptimizationConditions({
                    rtp: 0.38,
                    hitRate: 150,
                    searchConditions: { criteria: "freespins" },
                    priority: 2,
                }),
                basegame: new OptimizationConditions({
                    rtp: 0.52,
                    hitRate: 4,
                    priority: 1,
                }),
            },
            scaling: new OptimizationScaling([]),
            parameters: new OptimizationParameters(),
        },
    },
});

/* -------------------------------------------------------------------------- */
/*                                   RUN TASKS                                */
/* -------------------------------------------------------------------------- */

game.runTasks({
    doSimulation: true,
    doOptimization: false,
    doAnalysis: true,
    analysisOpts: {
        gameModes: ["base", "bonus"],
    },
});
