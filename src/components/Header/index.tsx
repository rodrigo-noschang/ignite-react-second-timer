import { Timer, Scroll } from 'phosphor-react';
import { NavLink } from 'react-router-dom';

import { HeaderContainer } from "./styles";

import LogoIgnite from '../../assets/Logo.svg'

export function Header() {
    return (
        <HeaderContainer>
            <span>
                <img src={LogoIgnite} alt="" />
            </span>

            <nav>
                <NavLink to='/' title='timer'>
                    <Timer size={24} />
                </NavLink>

                <NavLink to='/history' title='history'>
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    )
}