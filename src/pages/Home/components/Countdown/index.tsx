import { differenceInSeconds } from "date-fns";
import { useEffect, useContext } from "react";

import { CountDownContainer, CountDownSeparator } from "./styles"

import { CycleContext } from "../../";

export function Countdown() {
    const { activeCycle,
        activeCycleId,
        secondsPassed,
        markCurrentCycleAsFinished,
        updateSecondsPassed
    } = useContext(CycleContext);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    const remainingSeconds = activeCycle ? totalSeconds - secondsPassed : 0;

    const minutesAmount = Math.floor(remainingSeconds / 60);
    const secondsAmount = remainingSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    useEffect(() => {
        if (activeCycle) {
            document.title = `Ignite Timer - ${minutes}:${seconds}`;
        } else {
            document.title = 'Ignite Timer';
        }
    }, [minutes, seconds, activeCycle]);

    useEffect(() => {
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDiff = differenceInSeconds(new Date(), activeCycle.startDate);

                if (secondsDiff >= totalSeconds) {
                    markCurrentCycleAsFinished();

                    updateSecondsPassed(totalSeconds);
                    clearInterval(interval);
                } else {
                    updateSecondsPassed(secondsDiff);
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval);
        }

    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, updateSecondsPassed]);

    return (
        <CountDownContainer>
            <span> {minutes[0]} </span>
            <span> {minutes[1]} </span>
            <CountDownSeparator>
                :
            </CountDownSeparator>
            <span> {seconds[0]} </span>
            <span> {seconds[1]} </span>
        </CountDownContainer>
    )
}