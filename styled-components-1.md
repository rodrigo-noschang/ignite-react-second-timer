# Styled Components

## Instalação do Syled Components:

```sh
    $ npm i styled-components
    $ npm i -D @types/styled-components
```

Uma das grandes vantagens do Styled Components é a facilidade de aplicar estilizações condicionais aos componentes, nos permitindo a reutilização de um mesmo componente em diferentes casos, para diferentes propósitos, uma vez que essas estilizações condicionais podem atribuir diferentes significados para eles. 

Um exemplo clássico são os botões, que podem ter a mesma estrutura aparente, com os mesmos comportamentos de hover, click, etc, porém com cores diferentes: verde para casos de sucesso (no caso do botão executar uma confirmação), vermelho para um caso de perigo (como deletar algo que não pode ser recuperado), ou uma cor neutra da própria empresa (no caso de um botão que faça login, por exemplo), assim por diante. Em todos os casos podemos reutilizar o mesmo botão, mudando apenas a cor deles. 

Essa mudança de cor pode ser feita utilizando uma prop que o componente recebe, e essa prop é utilizada no momento em que a estilização é aplicada. Peguemos o seguinte componente de botão como exemplo:

```tsx
    interface ButtonProps {
        color?: 'primary' | 'secondary' | 'danger' | 'success'
    }

    export function Button({ color = 'primary' }: ButtonProps) {
        return (
            <>
                <button>
                    Enviar
                </button>
            </>
        )
    }
```

Agora vamos criar a estilização padrão dos botões usando o styled componente:

```ts
    import styled from "styled-components";

    export const ButtonContainer = styled.button`
        width: 120px;
        height: 40px;   
    `;
```

E agora, no nosso componente `Button`, ao invés de retornarmos a tag HTML button normalmente, vamos retornar esse ButtonContainer que acabamos de criar:

```jsx
    import { ButtonContainer } from "./Button.styles"

    interface ButtonProps {
        color?: 'primary' | 'secondary' | 'danger' | 'success'
    }

    export function Button({ color = 'primary' }: ButtonProps) {
        return (
            <>
                <ButtonContainer variant = {color}>
                    Enviar
                </ButtonContainer>
            </>
        )
    }
```

Agora, também, além de incluirmos esse componente no retorno, também estamos passando a prop color, da mesma forma como passaríamos para um componente normal. Para recuperá-la no nossos estilos, famos o seguinte:

```ts
    import styled, { css } from "styled-components";

    export type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'success';

    interface ButtonContainerProps {
        variant: ButtonVariants
    }

    const buttonVariantsColors = {
        primary: 'purple',
        secondary: 'orange',
        danger: 'red',
        success: 'green'
    }

    export const ButtonContainer = styled.button<ButtonContainerProps>`
        width: 120px;
        height: 40px;

        // Primeiro jeito
        background-color: ${props => buttonVariantsColors[props.variant]}

        // Segundo jeito
        ${props => {
            return css`background-color: ${buttonVariantsColors[props.variant]}`
        }}
    `;
```

Aqui, além de termos aplicado as props do componente estilizado nas estilizações, também tipamos as suas propriedades, e criamos um objeto que facilita a aplicação das cores baseado no valor recebido em `variant`. 

## Temass
O styled components nos permite criar e usar quantos temas quisermos, vamos criar um tema de exemplo na pasta `src/styles/themes/default.ts`:

```js
    export const defaultTheme = {
        primary: 'purple',
        secondary: 'orange',
        success: 'green',
        danger: 'red'
    }
```

No nosso `App.ts`, precisamos englobar toda a aplicação com o **ThemeProvider**, do próprio styled componente, para que o tema seja aplicado em todos os nossos componentes:

```js
    import { ThemeProvider } from "styled-components"

    import { Button } from "./components/Button"
    import { defaultTheme } from "./styles/themes/default"

    export function App() {

        return (
            <ThemeProvider theme={defaultTheme}>
            <div>
                <h1> Hello world </h1>

                <Button />
                <Button color='secondary' />
                <Button color='danger' />
                <Button color='success' />
            </div>
            </ThemeProvider>
        )
    }
```

Agora, podemos acessar, dentro do nosso `Button.styles.ts` as propriedades definidas nesse tema, dentro da própria **props**:

```js
    export const ButtonContainer = styled.button<ButtonContainerProps>`
        width: 120px;
        height: 40px;

        // Pegando a cor direto
        background-color: ${props => props.theme.primary};

        // Pegando a cor com a prop
        /* background-color: ${props => props.theme[props.variant]}; */
    `;
```

Isso já funciona, mas o intellisense ainda não está muito legal, vamos então definir a tipagem dos temas na pasta `@types/styled.d.ts`

```js
    import 'styled-components';

    import { defaultTheme } from '../styles/themes/default';

    type ThemeType = typeof defaultTheme;

    declare module 'styled-components' {
        export interface DefaultTheme extends ThemeType { }
    }
```

Aqui estamos primeiro criando o **ThemeType** apenas para "copiar" o tipo do defaultThemes, que definimos anteriormente. Depois disso, estamos "criando" um módulo chamado `styled-components`. Porém, como na primeira linha desse trecho de código, estamos importando o próprio `styled-components`, o typescript sabe que, na verdade, o que queremos é "integrar" o novo tipo que iremos declarar ao conjunto de tipos `styled-componentes`, que já existe. 

Se não fizéssemos essa importação, iríamos sobrescrever e, portanto, perder toda a tipagem do styled-components, ao invés de complementá-la com esses tipos do nosso tema. 

## Estilos Globais:
Vamos definir nossos estilos globais dentro da pasta `src/styles`, no arquivo `global.ts`:

```js
    import { createGlobalStyle } from "styled-components";

    export const GlobalStyle = createGlobalStyle`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #333;
            color: #fff;
        }
    `;
```

E agora vamos colocá-lo em algum lugar da nossa aplicação, de preferência o mais próximo da "raiz" da nossa estrutura de componentes. Um bom lugar para isso é o próprio `App.tsx`:

```js
    import { ThemeProvider } from "styled-components"

    import { Button } from "./components/Button"

    import { defaultTheme } from "./styles/themes/default"
    import { GlobalStyle } from "./styles/global"

    export function App() {

        return (
            <ThemeProvider theme={defaultTheme}>
            <div>
                <h1> Hello world </h1>

                <Button />
                <Button color='secondary' />
                <Button color='danger' />
                <Button color='success' />
            </div>

            <GlobalStyle />
            </ThemeProvider>
        )
    }
```

Vamos aprovitar os estilos globais para definir **fontes e cores**. Aqui nada novo, é fazer as importações pelo google fonts e colocar elas no index.html, conforme o próprio site sugere, e então usá-las nos estilos globais.

## Compartilhamento/Herança de estilos:
Pode acontecer de alguns componentes terem várias estilizações em comum, porém com alguns poucos detalhes de diferença entre um e outro, por exemplo, 2 inputs que têm exatamente a mesma aparência, mas um deles pode se expandir livremente, e o outro deve se manter em uma largura fixa. Nesse caso, podemos criar um componente com o estilo base, e criar os inputs de forma separada mas, dessa vez, estilizando esse componente ao invés de uma tag comum do HTML:

Aqui segue o estilo base que será compartilhado entre os dois inputs

```ts
    const BaseInput = styled.input`
        background-color: transparent;
        height: 2.5rem;
        border: 0;
        border-bottom: 2px solid ${props => props.theme["gray-500"]};
        font-weight: bold;
        font-size: 1.125rem;
        padding: 0 0.5rem;
        color: ${props => props.theme["gray-100"]};

        &::placeholder {
        color: ${props => props.theme["gray-500"]};
        }

        &:focus {
            box-shadow: none;
            border-color: ${props => props.theme["green-500"]};
        }
    `;
```

Aqui estão os inputs que foram criados a partir dele:

```jsx
    export const TaskInput = styled(BaseInput)`
        flex: 1;
    `;

    export const MinutesAmountInput = styled(BaseInput)`
        width: 4rem;
    `;
```

Como pode-se ver, ao invés de criarmos os botões a partir de um button normal, com o `styled.button`, estamos criando eles a partir do Base Input, com o `styled(BaseInput)`.