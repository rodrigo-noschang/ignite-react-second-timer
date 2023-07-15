# React Router DOM:
**React Router** é o pacote utilizado para tratar rotas com o react, o DOM, especificamente, é porque estamos utilizando rotas da web. Instalação:

```sh
    $ npm i react-router-dom
```

E vamos criar duas páginas novas para a nossa aplicação, a **Home** e o **History**, que nada mais são do que componentes também. Além deles, vamos criar também o componente **Router**, que vai definir quais páginas deverão ser mostradas em quais rotas da aplicação:

```tsx
    import { Routes, Route } from 'react-router-dom';

    import { Home } from './pages/Home';
    import { History } from './pages/History';

    export function Router() {
        return (
            <Routes>
                <Route path='/' element={<Home />} />

                <Route path='/history' element={<History />} />
            </Routes>
        )
    }
```

Definimos então o **path**, ou seja, a rota para aquele elemento, e também o elemento em si. Depois, jogamos esse Router no nosso **App** e, para que o Router funcione adequadamente, precisamos englobá-lo com o **BrowserRouter**, também importado do `react-router-dom`:

```tsx
    export function App() {

        return (
            <ThemeProvider theme={defaultTheme}>
                <BrowserRouter>
                    <Router />
                </BrowserRouter>

                <GlobalStyle />
            </ThemeProvider>
        )
    }
```

Agora, acessando nossa aplicação sem colocar nada adicional na rota, cairemos na página **Home**, e acessando ela com a "extensão" `/history`, cairemos na rota **History**.

## Layout de Rotas

No [figma da nossa aplicação](https://www.figma.com/file/qxApF9TGBHBU1XYgWTFkqm/Ignite-Timer-(Community)?type=design&node-id=0-1&mode=design&t=iLtSnV2Zh6sWNVDM-0), podemos ver que em **TODAS** as telas, alguns elementos se repetem, como a cor de fundo, o box com o conteúdo da tela e o header desse box com os mesmos botões e imagens. Se fizermos esses elementos de forma separada, repetindo eles para cada tela, o React será obrigado a re-renderizar todos novamente, cada vez que o usuário navegar entre elas. 

Esse pequeno detalhe, em grandes aplicações, com grande volume telas, e grande quantidade de acessos, pode gerar algum tipo de gargalo para o usuário de final. Para poder agilizar esse processo, vamos utilizar os chamados **Layouts**.

Vamos criar um Header de exemplo que será reutilizado em ambas as páginas:

```tsx
    export function Header() {
        return (
            <header>
                <h1> Header </h1>
            </header>
        )
    }
```

E agora vamos criar o **layout**, onde vamos definir esse Header como um componente reutilizável, na pasta `layouts/DefaultLayout.tsx`:

```tsx
    import { Outlet } from 'react-router-dom';

    import { Header } from "../components/Header";

    export function DefaultLayout() {
        return (
            <div>
                <Header />
                <Outlet />
            </div>
        )
    }
```

Estamos apenas criando um componente que faz uso do Header, e colocando um outro componente **Outlet**. Esse outlet, em outras palavras, é uma forma de dizer que será naquele espaço, naquela posição do componente, que o conteúdo da página será modificado dependendo da rota. Ou seja, quando a rota tiver final **/history**, o Outlet deverá mostrar o conteúdo do componente **History**, quando tiver final apenas **/**, deverá mostrar o conteúdo da página Home, conforme foi definido no nosso **Router** anteriormente.

Para que o Router tenha conhecimento desse layout, precisamos fazer a seguinte alteração nele:

```tsx
    export function Router() {
        return (
            <Routes>
                <Route path='/' element={<DefaultLayout />} >
                    <Route path='/' element={<Home />} />
                    <Route path='/history' element={<History />} />
                </Route>

            </Routes>
        )
    }
```

Coloremos mais elemento **Route** englobando todas as rotas, e agora ele recebe o DefaultLayout como elemento. E agora, nas páginas Home e History, o Header aparece e o react sabe que não precisa destruí-lo e recriá-lo entre as navegações, pois ele permanece o mesmo sempre. 

Também é importante notar que o **path** dessas rotas agora são um pouco diferente: O path dos elementos de dentro, serão uma continuação do path do Route que engloba eles. Se a estrutura tivesse o seguinte formato:

```tsx
    export function Router() {
        return (
            <Routes>
                <Route path='/user' element={<DefaultLayout />} >
                    <Route path='/info' element={<Home />} />
                    <Route path='/history' element={<History />} />
                </Route>

            </Routes>
        )
    }
```

As rotas que deveríamos acessar seriam: `/user/info`, e `/user/history`. 

## NavLink
O componente **NavLink** pode ser usado no lugar de links normais (âncoras) quando queremos redirecinoar o usuário para rotas internas da aplicação. A aplicação normal com link seria:

```html
    <nav>
        <a href="baseURL/">
            <Timer size={24} />
        </a>

        <a href="baseURL/history">
            <Scroll size={24} />
        </a>
    </nav>
```

E com o NavLink, do rect-router-dom, fica:

```tsx
    <nav>
        <NavLink to='/' title='timer'>
            <Timer size={24} />
        </NavLink>

        <NavLink to='/history' title='history'>
            <Scroll size={24} />
        </NavLink>
    </nav>
```

O title server para os leitores de tela. 

Quando um link ou outro for selecionado, o navlink adiciona à ancora uma classe `active`, podemos usar ela para alterar nossas estlilizações do link, indicando qual é o link que foi selecionado:

```css
    a {
        width: 3rem;
        height: 3rem;

        display: flex;
        align-items: center;
        justify-content: center;

        color: ${props => props.theme["gray-100"]};

        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;
        transition: .2s;

        &:hover {
            border-bottom-color: ${props => props.theme["green-500"]};
        }

        &.active {
            color: ${props => props.theme["green-500"]};
        }
    }
```

Esse seletor `a` está dentro do componente de estilização do Header, o `HeaderContainer`.