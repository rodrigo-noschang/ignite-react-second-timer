import { ThemeProvider } from 'styled-components'

import { Button } from './components/Button'

import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/global'

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