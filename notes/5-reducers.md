# Reducers
Reducers são recursos do próprio react, usados a partir do hook **useReducer**, que permitem armazenar informações e alterá-las futuramente, assim como os states permitem. A diferença é que os reducers armazenam informações mais complexas. Complexas no sentido de que a atualização dessas informações fazem uso de condicionais, cálculos, coisas do tipo, assim como acontece na nossa função de interromper um ciclo, ou finalizar o ciclo. Nessas funções, atualizamos somente uma chave de um determinado elemento do array de ciclos, e a atualização do estado fica da seguinte forma:

```js
    setCycles(state => state.map(cycle => {
        if (cycle.id === activeCycleId) {
            return {
                ...cycle,
                interruptedDate: new Date()
            }
        }
        return cycle;
    }))
```

A atualização depende do estado anterior, faz verificações, laços, etc. Nesses casos, faz sentido usarmos um reducer. 

A mecânica do useReducer funciona da seguinte forma. No nosso arquivo `CyclesContext.tsx`, ao invés de criarmos um estado para o `cycle` e o `setCycle`, vamos criar um reducer:

```jsx
    // Era assim, com state:
    const [cycles, setCycles] = useState<Cycle[]>([]);
    
    // Vai ficar assim, com reducer:
    const [cycles, dispatch] = useReducer((state: Cycle[], action: TIPO AQUI) => {

        return state;
    }, [])
```

Agora, no useReducer, vamos ter uma função, e um array. Até onde eu entendi, esse array é o valor inicial do "estado" cycles, que não é mais estado agora, mas se comporta como um. A **função** do useReducer recebe dois argumentos, **um state**, que é o valor atual da variável que estamos modificando, no caso o `cycles`. E uma **action**, que é um segundo argumento que nós é quem diremos qual valor ele terá. 

Podemos definir o valor da action quando executarmos a função **dispatch**, que é um dos argumentos retornados pelo useReducer. Esse dispatch é uma função, que podemos executar em qualquer lugar e, tudo que passarmos como argumento para o dispatch, será armazenado no valor da **action**. 

Ou seja, se em algum momento chamarmos o dispatch da seguinte forma:

```js
    dispatch('Ronaldo Nazário vulgo fenomeno');
```

O valor de action será a string `Ronaldo Nazário vulgo fenomeno`. 

O padrão da comunidade, porém, é que esse objeto action venha a ter o seguinte formato:

```js
    {
        type: 'TIPO_DA_ACAO_A_SER_EXECUTADA',
        payload: {
            data: dadoUsadoNaAcao
        }
    }
```

Dessa forma, dentro do corpo da função do useReducer, podemos verificar o tipo dessa action e, a partir dele, executar o que precisa ser executado, ou seja, criar um ciclo, interromper, concluir, etc. Agora nas nossas funções, ao invés de executarmos a alteração do estado diretamente nela, vamos fazer simplesmente invocar o dispatch, e passar as informações necessárias para atualizar o que for necessário. Por exemplo, na função que cria um novo ciclo, ela estava assim:

```js
    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles(prevState => [...prevState, newCycle]);
        setActiveCycleId(newCycle.id);
        setSecondsPassed(0);
    }
```

Agora, com o dispatch, ela ficará parecida com isso:

```js
    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle
            }
        })

        setActiveCycleId(newCycle.id);
        setSecondsPassed(0);
    }
```

E lá no nosso reducer, vamos interceptar esse objeto, que vai cair dentro do actions e fazer as validações e atualizações necessárias:

```js
    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
        if (action.type === 'ADD_NEW_CYCLE') {
            return [...state, action.payload.newCycle];
        }

        return state;
    }, []);
```

Então, pra resumir, verificamos o tipo dessa action, que nos diz qual ação fazer, e então autalizamos o estado incluindo esse novo ciclo. 

## Objeto no Reducer
Na nossa aplicação, vemos que temos 3 estados, pelo menos, que andam de mãos dadas em cada ciclo: a lista de ciclos, o id do ciclo ativo, e o **secondsPassed**. Sempre que íamos alterar alguma coisa no nosso timer, seja iniciando ou interrompendo ele, tínhamos que atualizar todos esses 3 ao mesmo tempo. 

Com o reducer, podemos juntar tudo isso num único estado, ao definir nosso estado principal como um objeto, seguindo essa interface, por exemplo:

```js
    interface CycleState {
        cycles: Cycle[],
        activeCycleId: string | null
    }
```

E agora a criação do nosso reducer fica um pouco diferente por alguns motivos: (1), não estamos mais recebendo no nosso antigo **cycle**, simplesmente o array de ciclos, estamos recebendo um objeto com uma chave cycle, e uma activeCycleId. Segundo, o valor inicial desse reducer não pode mais ser um array vazio, precisa ser um objeto com os valores iniciais dessas propriedades:

```js
    const [cyclesState, dispatch] = useReducer((state: CycleState, action: any) => {
        
    }, {
        cycles: [],
        activeCycleId: null
    });
```

Agora, a inicialização dele fica dessa forma, recebemos um **cycleState** ao invés de somente os **cycles**. 

Para atualizar esses valores, a lógica é exatamente a mesma, porém precisamos acessar o array de ciclos de dentro do objeto `cycleState`. Segue o exemplo de criar um novo ciclo:

```js
    const [cyclesState, dispatch] = useReducer((state: CycleState, action: any) => {
        if (action.type === 'ADD_NEW_CYCLE') {
            return {
                ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycle.id
            }
        }

        return state;
    }, {
        cycles: [],
        activeCycleId: null
    });
```

## Estruturando o Reducer:
Vamos passar todo o corpo da função do reducer para outro arquivo, no `src/reducers/cycles.ts`:

```js
    export interface Cycle {
        id: string,
        task: string,
        startDate: Date,
        finishedDate?: Date,
        minutesAmount: number,
        interruptedDate?: Date,
    }

    interface CycleState {
        cycles: Cycle[],
        activeCycleId: string | null
    }

    export function cyclesReducer(state: CycleState, action: any) {
        switch (action.type) {
            case 'ADD_NEW_CYCLE':
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id
                }

            case 'INTERRUPT_CURRENT_CYCLE':
                return {
                    ...state,
                    activeCycleId: null,
                    cycles: state.cycles.map(cycle => {
                        if (cycle.id === state.activeCycleId) {
                            return {
                                ...cycle,
                                interruptedDate: new Date()
                            }
                        }
                        return cycle;
                    }),
                }

            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
                return {
                    ...state,
                    activeCycleId: null,
                    cycles: state.cycles.map(cycle => {
                        if (cycle.id === state.activeCycleId) {
                            return {
                                ...cycle,
                                finishedDate: new Date()
                            }
                        }
                        return cycle;
                    }),
                }

            default:
                return state;
        }
    }
```


E o nosso reducer fica da seguinte forma:

```js
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    });
```

## Tipando o Type das actions:
Vamos começar crinado um enumerador das possíveis actions que teremos no nosso reducer, dentro do arquivo `cycles.tsx`:

```js
    export enum ActionTypes {
        ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
        INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
        MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
    }
```

E agora vamos substituir as strings que estão hardcoded no context e na função que acabamos de criar, pelo objeto ActionTypes. Então, onde antes estava `ADD_NEW_CYCLE`, agora vai ficar: `ActionTypes.ADD_NEW_CYCLE`.

## Tipando as Actions como um todo
Vamos mudar um pouco a estrutura das pastas. Ao invés de ser `src/reducers/cycles.ts`, vamos transformar o cycles numa pasta e renomar ele para reducer.ts, ficanod `src/reducers/cycles/reducer.ts`

E agora vamos criar um novo arquivo chamado `actions.ts`, dentro de cycles. Nele, já vamos jogar a criação do **ActionTypes** também. 

O que vamos fazer nesse arquivo também é criar uma funções que simplesmnete retornarão os objetos de cada dispatch. Por exemplo, no nosso dispatch de criar um novo ciclo, temos o seguinte objeto:

```js
    dispatch({  
        type: ActionTypes.ADD_NEW_CYCLE,
        payload: {
            newCycle
        }
    })
```

Nessa nova função, vamos ter a segunite estrutura:

```js
    export function addNewCycleAction(newCycle: Cycle) {
        return {
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: {
                newCycle
            }
        }
    }
```

Em alguns casos, pode ser que o dado necessário para a execução da funçao nem precisa ser passada, porque ela já existe no nosso reducer, é o caso, por exemplo, do mark cycle as finished. Ele precisa do id o ciclo ativo, mas esse id já existe no nosso state "compartilhado" do próprio reducer, então a função fica da seguinte forma:

```js
    export function markCurrentCycleAsFinishedAction() {
        return {
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
        }
}
```

Relembrando que a função que finaliza o ciclo está da seguinte forma:

```js
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
        return {
            ...state,
            activeCycleId: null,
            cycles: state.cycles.map(cycle => {
                if (cycle.id === state.activeCycleId) {
                    return {
                        ...cycle,
                        finishedDate: new Date()
                    }
                }
                return cycle;
            }),
        }
```

E esse `state` está vindo do parâmetro da função fornecida pelo reducer. 