import * as zod from 'zod';
import { useState } from 'react';
import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CountDownContainer,
    CountDownSeparator,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    StartCountDownButton,
    TaskInput
} from './styles';

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.coerce.number().min(5).max(60)
})

type NewCycleFormSchema = zod.infer<typeof newCycleFormSchema>

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [secondsPassed, setSecondsPassed] = useState<number>(0);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const remainingSeconds = activeCycle ? totalSeconds - secondsPassed * 60 : 0;

    const minutesAmount = Math.floor(remainingSeconds / 60);
    const secondsAmount = remainingSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    function handleCreateNewCycle(data: NewCycleFormSchema) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount
        }

        setCycles(prevState => [...prevState, newCycle]);
        setActiveCycleId(newCycle.id);

        reset();
    }

    const task = watch('task');
    const isSubmitDisabled = !task;

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

                <StartCountDownButton disabled={isSubmitDisabled}>
                    <Play />
                    Começar
                </StartCountDownButton>
            </form>
        </HomeContainer>
    )
}