import * as zod from 'zod';
import { useState, useEffect } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInSeconds } from 'date-fns';

import {
    CountDownContainer,
    CountDownSeparator,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    StartCountDownButton,
    StopCountDownButton,
    TaskInput
} from './styles';

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.coerce.number().min(1).max(60)
})

type NewCycleFormSchema = zod.infer<typeof newCycleFormSchema>

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
    const [secondsPassed, setSecondsPassed] = useState(0);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
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
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDiff = differenceInSeconds(new Date(), activeCycle.startDate);

                if (secondsDiff >= totalSeconds) {
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
                    setSecondsPassed(totalSeconds);
                    clearInterval(interval);
                } else {
                    setSecondsPassed(secondsDiff);
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval);
        }

    }, [activeCycle, totalSeconds, activeCycleId]);

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
                <FormContainer>
                    <label htmlFor='task'>
                        Vou trabalhar em
                    </label>
                    <TaskInput
                        id='task'
                        placeholder='Dê um nome ao seu projeto'
                        list='tasks-suggestions'
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id='tasks-suggestions'>
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Projeto 4" />
                    </datalist>

                    <label htmlFor='minutesAmount'>
                        Durante
                    </label>
                    <MinutesAmountInput
                        id='minutesAmount'
                        type='number'
                        placeholder='00'
                        step={5}
                        min={1}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount')}
                    />

                    <span> minutos. </span>
                </FormContainer>

                <CountDownContainer>
                    <span> {minutes[0]} </span>
                    <span> {minutes[1]} </span>
                    <CountDownSeparator>
                        :
                    </CountDownSeparator>
                    <span> {seconds[0]} </span>
                    <span> {seconds[1]} </span>
                </CountDownContainer>

                {
                    activeCycle ?
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