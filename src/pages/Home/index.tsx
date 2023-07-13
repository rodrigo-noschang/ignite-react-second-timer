import { useState, useEffect } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { differenceInSeconds } from 'date-fns';

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

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    const remainingSeconds = activeCycle ? totalSeconds - secondsPassed : 0;

    const minutesAmount = Math.floor(remainingSeconds / 60);
    const secondsAmount = remainingSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

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

    useEffect(() => {
        if (activeCycle) {
            document.title = `Ignite Timer - ${minutes}:${seconds}`;
        } else {
            document.title = 'Ignite Timer';
        }
    }, [minutes, seconds, activeCycle]);

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <NewCycleForm />

                <Countdown />

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