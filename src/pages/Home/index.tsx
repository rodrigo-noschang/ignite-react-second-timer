import { Play } from 'phosphor-react';

import {
    CountDownContainer,
    CountDownSeparator,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    StartCountDownButton,
    TaskInput
} from './styles';

export function Home() {
    return (
        <HomeContainer>
            <form>
                <FormContainer>
                    <label htmlFor='task'>
                        Vou trabalhar em
                    </label>
                    <TaskInput
                        id='task'
                        placeholder='Dê um nome ao seu projeto'
                        list='tasks-suggestions'
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

                <StartCountDownButton disabled>
                    <Play />
                    Começar
                </StartCountDownButton>
            </form>
        </HomeContainer>
    )
}