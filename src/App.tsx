import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom';

import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/global'

import { Router } from './pages/Router'
import { CycleContextProvider } from './contexts/CyclesContexts';

export function App() {

	return (
		<ThemeProvider theme={defaultTheme}>
			<BrowserRouter>
				<CycleContextProvider>
					<Router />
				</CycleContextProvider>
			</BrowserRouter>

			<GlobalStyle />
		</ThemeProvider>
	)
}