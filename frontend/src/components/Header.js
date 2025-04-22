
import Logo from './../images/logo.jpeg';
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom'

const btnStyle = {
    backgroundColor : "#FF7151",
    color : "#FFFFFA",
    padding : "16px 72px"
}

function Header( props ){


    return (
        <header className="dflex ai-center jc-between" style={{padding : "12px"}}>
            <Link to="/">
                <img src={Logo} alt="logo" height="100px" width="140px" style={{ borderRadius : "12px"}}></img>
            </Link>
            { props.hasLoginBtn && 
                <Link to="/login">
                    <Button style={ btnStyle }> Login </Button>
                </Link>
            }
        </header>
    )
}

export default Header;