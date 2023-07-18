# Salvando ciclos no Storage do usuário
Como nossa aplicação não tem um banco de dados para salvar os ciclos, e queremos manter um histórico dos usuários, vamos usar do storage do próprio navegador para armazenar essas informações. No nosso `CyclesContext`, vamos criar um useEffect para armazenar o estado dos nossos ciclos sempre que o houver alguma alteração nele próprio:

```js
    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
    }, [cyclesState]);
```

Aqui, o Diegão incluiu no nome da chave a versão desse aplicativo para que, caso em futuras versões do aplicativo, esse formato de dado mude, a versão sirva para diferenciar os dados armazenados e não ter conflito.

Agora, além da criação e armazenamento desses dados no storage do usuário, precisamos recuperá-los também para poder reutilizar esses dados quando a aplicação for (re)carregada. Para isso, o useReducer nos oferece um terceiro parâmetro na sua criação , que é como se fosse um useEffect próprio dele. Esse terceiro parâmetro é uma função que será executada no momento em que ele for criado:

```js
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    }, (initialState) => {
        const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON);
        }

        return initialState;
    });
```

Nela estamos pegando o conteúdo do storage em JSON e, se ele existir, devolvemos o parse dele. Se não existir, devolvemos o `initialState`, que é exatemente o que foi definido no segundo parâmetro do reducer. 