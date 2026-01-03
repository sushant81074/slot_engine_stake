import { GeneratedReelSet } from "@slot-engine/core"

/**
 * NUMBER GAME SYMBOLS
 *
 * BLANK = "-1"
 * N0    = "0"
 * N00   = "00"
 * N1    = "1"
 * N5    = "5"
 * N10   = "10"
 */
export type NumberSymbol =
    | "BLANK"
    | "N0"
    | "N00"
    | "N1"
    | "N5"
    | "N10"

const SYMBOL_WEIGHTS = {
    base: {
        BLANK: 8,
        N0: 7,
        N00: 10,
        N1: 19,
        N5: 18,
        N10: 23,
    },
    bonus: {
        BLANK: 5,
        N0: 8,
        N00: 12,
        N1: 20,
        N5: 20,
        N10: 35,
    },
    maxwin: {
        BLANK: 0,
        N0: 5,
        N00: 10,
        N1: 15,
        N5: 30,
        N10: 60,
    },
} as const

const defaultSettings = {
    overrideExisting: false,

    symbolQuotas: {
        BLANK: 0.25,
    },

    spaceBetweenSameSymbols: 1,

    limitSymbolsToReels: {
        N10: [1, 2, 3],
    },
}

export const GENERATORS = {
    base: new GeneratedReelSet({
        id: "number_base",
        ...defaultSettings,
        symbolWeights: SYMBOL_WEIGHTS.base,
    }),

    bonus: new GeneratedReelSet({
        id: "number_bonus",
        ...defaultSettings,
        symbolWeights: SYMBOL_WEIGHTS.bonus,
    }),

    maxwin: new GeneratedReelSet({
        id: "number_maxwin",
        ...defaultSettings,
        symbolWeights: SYMBOL_WEIGHTS.maxwin,
    }),
} as const
