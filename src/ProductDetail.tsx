import Card from "@mui/material/Card";
import { useLocation } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import { CardContent, Select, TextField } from "@mui/material";
import { Categorys } from "./interface/categorys";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useState } from "react";

/**
 * 商品詳細画面
 * @returns jsx
 */
function ProductDetail(){
    const location = useLocation();
    const [categorys,setCategorys] = useState(location?.state?.categorys)

    return(
        <div>
        </div>
    )  
}

export default ProductDetail;
