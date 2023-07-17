import { ReactNode, createContext, useState } from "react";

interface CreateCycleData {
    task: string,
    minutesAmount: number
}

export interface Cycle {
    id: string,
    task: string,
    startDate: Date,
    finishedDate?: Date,
    minutesAmount: number,
    interruptedDate?: Date,
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
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [secondsPassed, setSecondsPassed] = useState(0);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    function updateSecondsPassed(seconds: number) {
        setSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {
        setCycles(state => state.map(cycle => {
            if (cycle.id === activeCycleId) {
                return {
                    ...cycle,
                    finishedDate: new Date()
                }
            }
            return cycle;
        }))
        setActiveCycleId(null);
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles(prevState => [...prevState, newCycle]);
        setActiveCycleId(newCycle.id);
        setSecondsPassed(0);

        // reset();
    }

    function interruptCurrentCycle() {
        setCycles(state => state.map(cycle => {
            if (cycle.id === activeCycleId) {
                return {
                    ...cycle,
                    interruptedDate: new Date()
                }
            }
            return cycle;
        }))

        setActiveCycleId(null);
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