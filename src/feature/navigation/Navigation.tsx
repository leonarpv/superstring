import React from 'react';
import * as ReactRedux from 'react-redux';
import {
    Link,
    NavLink
}
from 'react-router-dom';
import {
    Navbar,
    Nav,
    NavDropdown
}
from 'react-bootstrap';
import * as State from '../../app/store';
import Images from '../../image';
import Language from '../../api/Language';
import { showLanguages } from '../i18n/i18nSlice';
import './Navigation.css';

const Navigation: React.FC = () => {
    const [expanded, setExpanded] = React.useState(false);

    const language = ReactRedux.useSelector((state: State.RootState) => state.i18n.language);

    const dispatch = ReactRedux.useDispatch<State.AppDispatch>();

    const getImage = () => {
        switch (language) {
            case Language.EN_US:
                return <Images.US className="nav-icon" title="United States of America" />;
            case Language.EN_GB:
                return <Images.GB className="nav-icon" title="United Kingdom" />;
            case Language.EN_CA:
                return <Images.CA className="nav-icon" title="Canada" />;
            default:
                return <Images.Language className="nav-icon" title="Unknown" />;
        }
    };

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="sm"
            sticky="top"
            expanded={expanded}
            onToggle={value => setExpanded(value)}
            onSelect={() => setExpanded(false)}>
            <Navbar.Toggle />
            <Navbar.Brand as={Link} to="/">
                <Images.Logo height="32" width="32" title="Superstring" />
            </Navbar.Brand>
            <div className="d-none d-sm-block flex-grow-1" />
            <a href="https://github.com/ddsoyka/superstring" className="mr-sm-3">
                <Images.GitHub height="32" width="32" title="GitHub" />
            </a>
            <Navbar.Collapse className="flex-grow-0">
                <Nav>
                    <NavDropdown title="Tools" id="tools">
                        <NavDropdown.Item as={NavLink} to="/random">Random</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/convert">Convert</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/calculator">Calculator</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/about">About</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to="/help">Help</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => dispatch(showLanguages())}>
                            <span className="d-sm-none mr-3">Language</span>
                            {getImage()}
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
