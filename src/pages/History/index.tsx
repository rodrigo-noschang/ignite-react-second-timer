import { useContext } from "react";

import { HistoryContainer, HistoryList, Status } from "./styles";

import { Cycle, CycleContext } from "../../contexts/CyclesContexts";

export function History() {
    const { cycles } = useContext(CycleContext);

    function findCycleStatus(cycle: Cycle) {
        return cycle.finishedDate ? 'Concluído'
            : cycle.interruptedDate ? 'Interrompido'
                : 'Em andamento';
    }

    function findStatusColor(cycle: Cycle) {
        return cycle.finishedDate ? 'green'
            : cycle.interruptedDate ? 'red'
                : 'yellow';
    }

    return (
        <HistoryContainer>
            <h1> Meu histórico </h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th> Tarefa </th>
                            <th> Duração </th>
                            <th> Início </th>
                            <th> Status </th>
                        </tr>
                    </thead>

                    <tbody>
                        {cycles.map((cycle) => (
                            <tr>
                                <td> {cycle.task} </td>
                                <td> {cycle.minutesAmount} minutos </td>
                                <td> Há 2 meses </td>
                                <td>
                                    <Status statusColor={findStatusColor(cycle)}>
                                        {findCycleStatus(cycle)}
                                    </Status>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}