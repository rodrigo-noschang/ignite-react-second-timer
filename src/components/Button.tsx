import { ButtonContainer, ButtonVariants } from "./Button.styles"

interface ButtonProps {
    color?: ButtonVariants
}

export function Button({ color = 'primary' }: ButtonProps) {
    return (
        <>
            <ButtonContainer variant={color}>
                Enviar
            </ButtonContainer>
        </>
    )
}