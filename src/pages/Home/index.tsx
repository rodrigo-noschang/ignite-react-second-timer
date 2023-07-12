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
                    />

                    <label htmlFor='minutesAmount'>
                        Durante
                    </label>
                    <MinutesAmountInput
                        id='minutesAmount'
                        type='number'
                        placeholder='00'
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