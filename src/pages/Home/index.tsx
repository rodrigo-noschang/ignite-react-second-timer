import * as zod from 'zod';
import { HandPalm, Play } from 'phosphor-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import {
    HomeContainer,
    StartCountDownButton,
    StopCountDownButton
} from './styles';

import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';
import { useContext } from 'react';
import { CycleContext } from '../../contexts/CyclesContexts';

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.coerce.number().min(1).max(60)
});

type NewCycleFormSchema = zod.infer<typeof newCycleFormSchema>

export function Home() {
    const { createNewCycle, activeCycle, interruptCurrentCycle } = useContext(CycleContext);

    const newCycleForm = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const { handleSubmit, reset, watch } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormSchema) {
        createNewCycle(data);

        reset();
    }

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>

                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>

                <Countdown />

                {activeCycle ?
                    <StopCountDownButton
                        type='button'
                        onClick={interruptCurrentCycle}
                    >
                        <HandPalm />
                        Interromper
                    </StopCountDownButton>

                    :

                    <StartCountDownButton >
                        <Play />
                        Iniciar
                    </StartCountDownButton>
                }
            </form>
        </HomeContainer>
    )
}