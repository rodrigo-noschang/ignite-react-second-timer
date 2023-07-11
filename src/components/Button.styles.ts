import styled from "styled-components";

export type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps {
    variant: ButtonVariants
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
    width: 120px;
    height: 40px;
    border: none;
    margin: 8px;
    border-radius: 5px;


    color: ${props => props.theme.white};
    background-color: ${props => props.theme["green-500"]};
`;