import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormContainer, TaskInput, MinutesAmountInput } from "./styles";
import { CycleContext } from '../../../../contexts/CyclesContexts';


export function NewCycleForm() {
    const { activeCycle } = useContext(CycleContext);
    const { register } = useFormContext();

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
                min={5}
                max={60}
                disabled={!!activeCycle}
                {...register('minutesAmount')}
            />

            <span> minutos. </span>
        </FormContainer>
    )
}