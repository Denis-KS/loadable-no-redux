export const notReachable = (_: never) => {
    throw new Error(`Should never be reached ${_}`);
}