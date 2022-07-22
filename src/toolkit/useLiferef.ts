import { useLayoutEffect, useRef } from "react";

export const useLiferef = <T>(target: T) => {
    const ref = useRef(target);

    useLayoutEffect(() => {
        ref.current = target
    }, []);

    return ref;
};