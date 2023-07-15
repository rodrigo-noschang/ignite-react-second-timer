import { differenceInSeconds } from "date-fns";
import { useEffect, useState, useContext } from "react";

import { CountDownContainer, CountDownSeparator } from "./styles"

import { CycleContext } from "../../";

export function Countdown() {
    const [secondsPassed, setSecondsPassed] = useState(0);

    const { activeCycle, activeCycleId, markCurrentCycleAsFinished } = useContext(CycleContext);

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

    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished]);

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