import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormContainer, TaskInput, MinutesAmountInput } from "./styles";

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.coerce.number().min(1).max(60)
})

export type NewCycleFormSchema = zod.infer<typeof newCycleFormSchema>

export function NewCycleForm() {
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    return (
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
    )
}