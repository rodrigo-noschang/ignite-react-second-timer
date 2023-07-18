# Immer
Biblioteca usada para trabalhar com dados imutáveis como se fosse mutáveis. A ideia dessa biblioteca, nessa aplicação, é facilitar a atualização de alguns estados, quando essa modificação é feita em um nível "profundo" demais. É o que acontece, por exemplo, na nossa função de interromper um ciclo. Para atualizar essa informação precisamos rodar o array de ciclos inteiro, procurando pelo ciclo ativo através de seu id, e então reconstruir todo o objeto desse ciclo apenas para atualizar uma chave dela, no caso, a chave `interruptedAt`. 

O immer nos permite alterar esses valores como se fizéssemos em variáveis comuns do javascript, e ele cuida de tornar essa alteração aceitável para disparar o processo de render do react. 

```sh
    $ npm i immer
```

Vamos primeiro reescrever a função de criar um novo ciclo, que está sendo feita dessa forma (apenas a parte de alterar a propriedade imutável):

```js
    case ActionTypes.ADD_NEW_CYCLE:
        return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id
        }
```

```js
    import { produce } from 'immer'; 

    case ActionTypes.ADD_NEW_CYCLE:
        return produce(state, (draft) => {
            draft.cycles.push(action.payload.newCycle);
            draft.activeCycleId = action.payload.newCycle.id;
        })
```

Aqui não se ganhou muito em complexidade de código, mas deu pra ter uma ideia de como funciona. Agora, no `INTERRUPT_CURRENT_CYCLE`, a versão antiga era:

```js
    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
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
```

E a versão "mutável" dele, com o immer, fica da seguinte forma: 

```js
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
        const currentCycleIndex = state.cycles.findIndex(cycle => {
            return cycle.id === state.activeCycleId;
        })

        if (currentCycleIndex < 0) return state;

        return produce(state, draft => {
            draft.cycles[currentCycleIndex].interruptedDate = new Date();
            draft.activeCycleId = null;
        });
    }
```

Com certeza fica mais fácil de entender. 