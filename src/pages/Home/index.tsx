import { useState, createContext } from 'react';
import { HandPalm, Play } from 'phosphor-react';

import {
    HomeContainer,
    StartCountDownButton,
    StopCountDownButton
} from './styles';

import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';

import { NewCycleFormSchema } from './components/NewCycleForm';

interface Cycle {
    id: string,
    task: string,
    startDate: Date,
    finishedDate?: Date,
    minutesAmount: number,
    interruptedDate?: Date,
}

interface CycleContextType {
    activeCycle: Cycle | undefined,
    activeCycleId: string | null,

    markCurrentCycleAsFinished: () => void
}

export const CycleContext = createContext({} as CycleContextType);

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

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

    function handleCreateNewCycle(data: NewCycleFormSchema) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles(prevState => [...prevState, newCycle]);
        setActiveCycleId(newCycle.id);
        setSecondsPassed(0);

        reset();
    }

    function handleInteruptCycle() {
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

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>

                <CycleContext.Provider value={{
                    activeCycle,
                    activeCycleId,
                    markCurrentCycleAsFinished
                }}>
                    <NewCycleForm />
                    <Countdown />
                </CycleContext.Provider>

                {activeCycle ?
                    <StopCountDownButton
                        type='button'
                        disabled={!isSubmitDisabled}
                        onClick={handleInteruptCycle}
                    >
                        <HandPalm />
                        Iniciar
                    </StopCountDownButton>

                    :

                    <StartCountDownButton disabled={isSubmitDisabled}>
                        <Play />
                        Interromper
                    </StartCountDownButton>
                }
            </form>
        </HomeContainer>
    )
}