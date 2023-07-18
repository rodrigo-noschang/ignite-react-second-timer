import { ReactNode, createContext, useReducer, useState, useEffect } from "react";

import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
    task: string,
    minutesAmount: number
}

interface CycleContextType {
    cycles: Cycle[],
    secondsPassed: number
    activeCycleId: string | null,
    activeCycle: Cycle | undefined,

    interruptCurrentCycle: () => void,
    markCurrentCycleAsFinished: () => void,
    updateSecondsPassed: (seconds: number) => void,
    createNewCycle: (data: CreateCycleData) => void

}

export const CycleContext = createContext({} as CycleContextType);

interface CycleContextProviderProps {
    children: ReactNode
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    }, (initialState) => {
        const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON);
        }

        return initialState;
    });

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    const [secondsPassed, setSecondsPassed] = useState(() => {
        if (activeCycle) {
            const secondsDiff = differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate)
            );

            return secondsDiff;
        }

        return 0;
    });

    function updateSecondsPassed(seconds: number) {
        setSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {

        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch(addNewCycleAction(newCycle));

        setSecondsPassed(0);
    }

    function interruptCurrentCycle() {

        dispatch(interruptCurrentCycleAction())
        setSecondsPassed(0);
    }

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
    }, [cyclesState]);

    return (
        <CycleContext.Provider value={{
            cycles,
            activeCycle,
            activeCycleId,
            secondsPassed,
            createNewCycle,
            updateSecondsPassed,
            interruptCurrentCycle,
            markCurrentCycleAsFinished,
        }}>
            {children}
        </CycleContext.Provider>
    )
}