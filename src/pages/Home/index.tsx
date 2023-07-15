import * as zod from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, createContext } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    HomeContainer,
    StartCountDownButton,
    StopCountDownButton
} from './styles';

import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';

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
    secondsPassed: number

    markCurrentCycleAsFinished: () => void,
    updateSecondsPassed: (seconds: number) => void
}

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.coerce.number().min(1).max(60)
});

export type NewCycleFormSchema = zod.infer<typeof newCycleFormSchema>

export const CycleContext = createContext({} as CycleContextType);

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [secondsPassed, setSecondsPassed] = useState(0);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const newCycleForm = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm;

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
                    secondsPassed,
                    updateSecondsPassed,
                    markCurrentCycleAsFinished,
                }}>

                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>

                    <Countdown />
                </CycleContext.Provider>

                {activeCycle ?
                    <StopCountDownButton
                        type='button'
                        disabled={!isSubmitDisabled}
                        onClick={handleInteruptCycle}
                    >
                        <HandPalm />
                        Interromper
                    </StopCountDownButton>

                    :

                    <StartCountDownButton disabled={isSubmitDisabled} >
                        <Play />
                        Iniciar
                    </StartCountDownButton>
                }
            </form>
        </HomeContainer>
    )
}