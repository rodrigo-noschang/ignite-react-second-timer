import { ReactNode, createContext, useReducer, useState } from "react";

import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

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
    });

    const { cycles, activeCycleId } = cyclesState;


    const [secondsPassed, setSecondsPassed] = useState(0);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

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