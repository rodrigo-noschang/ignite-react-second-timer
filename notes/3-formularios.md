# Formulários
Sempre que trabalhamos com formulários, estamos assumindo, indiretamente, várias responsabilidades de verificação e validação de inputs. De maneira gera, temos duas formas de trabalhar com os formulários, ou com os inputs dos formulários:

- **Controlled**: É quando mantemos, em tempo real, a informação que o usuário está inserindo nos inputs em um estado do componente. Sempre que houver uma alteração em algum input, atualizamos o estado referente a ele. Além disso, também devolvemos o valor do state para o input, de forma a possibilitar um clear dos campos do formulário. A vantagem desse método é que a implementação dele é bastante simples, apesar de muito verbosa, e também fica fácil de habilitar/desabilitar alguns campos a partir dos valores de outros inputs.

A desvantagem, além do fato de ser uma implementação que fica exponencialmente mais verbosa, conforme o formulário aumenta, é que sempre que um estado tem seu valor alterado no React, uma nova renderização da tela é executada. Dependendo do tamanho e complexidade da tela, isso pode ser um problema. 

- **Uncontrolled**: Nesse caso, buscamos os valores dos inputs somente quando eles forem necessários como, por exemplo, no momento do submit do formulários. A vantagem é que não temos mais renderizações toda vez que um input é alterado, mas perdemos esse controle dos inputs em tempo real, e não podemos mais habilitar/desabilitar outros campos. 

Nesse caso, podemos usar os próprios métodos do JS, como o document.getElementsById, ou o useRef, para buscar os valores do input em um momento específico. 

## React Hook Form
Nessa biblioteca conseguimos unir os dois casos acima. Vamos instalar ela:

```sh
    $ npm i react-hook-form
```

E lá na nossa página de Home, onde temos o formulário do nosso cronometro, vamos usar ela:

```jsx
    import { useForm } from 'react-hook-form';

    const { register, handleSubmit, watch } = useForm();

    function handleCreateNewCycle(data: any) {
        console.log(data);
    }

    // No retorno do componente:
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                ...
                <input
                    id='task'
                    placeholder='Dê um nome ao seu projeto'
                    list='tasks-suggestions'
                    {...register('task')}
                />

                
                <input
                    id='minutesAmount'
                    type='number'
                    placeholder='00'
                    step={5}
                    min={5}
                    max={60}
                    {...register('minutesAmount')}
                />
                ...
            </form>
        </HomeContainer>
    )
```

E se quisermos observar o valor dos inputs para habilitar/desabilitar algum campo ou botão, podemos usar o recurso **watch** retornado de dentro do `useForm` também.

```jsx
    const { register, handleSubmit, watch } = useForm();

    function handleCreateNewCycle(data: any) {
        console.log(data);
    }

    const task = watch('task');
    const isSubmitDisabled = !task;

    return(
        ...
         <StartCountDownButton disabled={isSubmitDisabled}>
            <Play />
            Começar
        </StartCountDownButton>
    )
```

## Validação de Inputs
Apesar da simplicidade que o react hook form oferece ao lidar com formulários, ele não provê nenhuma forma de validações de input por si só, mas ela é facilmente integrável com bibliotecas já existentes, como o yup, zod, assim por diante. Nesse caso, utilizaremos o **zod**, mais por conta da integração com o typescript:

```sh
    $ npm i zod
```

E também vamos instalar o pacote que vai nos permitir integrar o zod ao react hook form:

```sh
    $ npm i @hookform/resolvers
```

Vamos primeiro criar um schema que descreva os campos do nosso formulário:

```js
import * as zod from 'zod';

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.coerce.number().min(5).max(60)
})
```

E agora vamos passar esse schema como resolver do nosso useForm:

```jsx
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, watch } = useForm({
        resolver: zodResolver(newCycleFormSchema),
    });
```

Feito isso, nosso formulário só executar a função definida no handleSubmit quando todas as condições definidas do schema forem satisfeitas, ou seja, quando o input **task** tiver ao menos 1 caracter e quando o **minutesAmount** for um número entre 5 e 60.

## Integrando o Form ao TS
Uma coisa que facilita muito o desenvolvimento dos formulários, além de antecipar possíveis erros, é criar a tipagem do mesmo. Poderíamos fazer uma interface com todos os campos e descrever esse formulários, como por exemplo:

```js
    interface NewCycleFormData {
        task: string,
        minutesAmount: number
    }
```

E poderíamos passar esse tipo para o useForm:

```js
    const { register, handleSubmit, watch } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormSchema),
    });
```

Isso tá certo e funciona, mas também podemos utilizar uma funçãozinha do **zod**, chamada **infer**, que faz a criação dessa interface/tipagem, baseado no esquema que definimos anteriormente:

```js
    type NewCycleFormData = zod.infer<typeof newCycleFormSchema>;
```

E passamos esse NewCycleFormData da mesma forma como foi feito antes.

## Limpando formulário
É costumeiro limpar os campos do formulário depois que o submit é feito e, para isso, o useForm também retorna o método **reset** de dentro dele:

```jsx
const { register, handleSubmit, watch, reset } = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema)
    });

    // Função de submit
    function handleCreateNewCycle(data: NewCycleFormSchema) {
        console.log(data);

        reset();
    }
```

Um detalhe importante é que pode ser que, em alguns casos, o reset não funcione normalmente e, para garantir que os campos serão limpos, podemos informar o **defaultValues** dentro do objeto de parâmetro di useForm. Assim, o reset que deve retornar os valores dos inputs para os valores que forem definidos como padrão nesse objeto:

```js
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormSchema>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });
```