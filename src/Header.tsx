import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import { Path } from './constant/path';


interface Props{
    title?:string,
    categorys?:any
}

function Header(props:Props){
    const navigate = useNavigate();
    const thisCategorys = JSON.parse(JSON.stringify(props.categorys));

    //ショッピングカートアイコンクリックイベント
    const shoppingCartIconClick = () => {
        navigate(Path.CARTPAGE,{state:{categorys:thisCategorys}})
    }

    //
    const permIdentityIconClick = () => {
        navigate(Path.TOP)
    }

    return(
            <Toolbar>
                <p style={{margin:"0 auto"}}>
                    {props.title}
                </p>
                
                <div onClick={shoppingCartIconClick}>
                    <ShoppingCartIcon />
                </div>

                <div onClick={permIdentityIconClick} >
                    <PermIdentityIcon />
                </div>
            </Toolbar>
    )
}

export default Header;
