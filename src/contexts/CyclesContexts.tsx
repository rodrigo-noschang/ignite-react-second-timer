import { ReactNode, createContext, useReducer, useState } from "react";

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

interface CycleState {
    cycles: Cycle[],
    activeCycleId: string | null
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
    const [cyclesState, dispatch] = useReducer((state: CycleState, action: any) => {
        switch (action.type) {
            case 'ADD_NEW_CYCLE':
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id
                }

            case 'INTERRUPT_CURRENT_CYCLE':
                return {
                    ...state,
                    activeCycleId: null,
                    cycles: state.cycles.map(cycle => {
                        if (cycle.id === state.activeCycleId) {
                            return {
                                ...cycle,
                                interruptedDate: new Date()
                            }
                        }
                        return cycle;
                    }),
                }

            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
                return {
                    ...state,
                    activeCycleId: null,
                    cycles: state.cycles.map(cycle => {
                        if (cycle.id === state.activeCycleId) {
                            return {
                                ...cycle,
                                finishedDate: new Date()
                            }
                        }
                        return cycle;
                    }),
                }

            default:
                return state;
        }
    }, {
        cycles: [],
        activeCycleId: null
    });

    const { cycles, activeCycleId } = cyclesState;


    const [secondsPassed, setSecondsPassed] = useState(0);
    // const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    function updateSecondsPassed(seconds: number) {
        setSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {

        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId
            }
        })
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle
            }
        })

        setSecondsPassed(0);
    }

    function interruptCurrentCycle() {

        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload: {
                activeCycleId
            }
        })
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