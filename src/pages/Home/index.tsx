import * as zod from 'zod';
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

export function Home() {
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    function handleCreateNewCycle(data: NewCycleFormSchema) {
        console.log(data);

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
                    <span> 0 </span>
                    <span> 0 </span>
                    <CountDownSeparator>
                        :
                    </CountDownSeparator>
                    <span> 0 </span>
                    <span> 0 </span>
                </CountDownContainer>

                <StartCountDownButton disabled={isSubmitDisabled}>
                    <Play />
                    Começar
                </StartCountDownButton>
            </form>
        </HomeContainer>
    )
}