import { useEffect, useState } from "react";

import { CountDownContainer, CountDownSeparator } from "./styles"
import { differenceInSeconds } from "date-fns";

interface CountDownProps {
    activeCycle: any
}

export function Countdown({ activeCycle }: CountDownProps) {
    const [secondsPassed, setSecondsPassed] = useState(0);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

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