import Card from "@mui/material/Card";
import { useLocation } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import { CardContent, Select, TextField } from "@mui/material";
import { Categorys } from "./interface/categorys";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useLayoutEffect, useState } from "react";
import Header from "./Header";
import { CategorysItems } from "./interface/categorysItems";

/**
 * カートページ画面
 * @returns jsx
 */
function CartPage(){
    const location = useLocation();
    //カテゴリー一覧
    const [categorys,setCategorys] = useState([]);
    //小計
    const [subTotals,setSubtotals] = useState(0);
    //合計
    const [total,setTotal] = useState(0);

    useLayoutEffect(() => {
        axios.get("http://localhost:3004/categorys/register")
        .then((res:AxiosResponse) => {
          //HTTPレスポンスが200
          if(res.status === HttpStatusCode.Ok){
            let categorys = res.data;
            //カテゴリー一覧を最新化
            setCategorys(categorys);
            //小計を計算する
            calSubtotals(categorys);
            //合計を計算する
            calTotal(categorys);
          }
          console.info(res);
        })
        .catch((error:AxiosError) => {
          console.error(error);
        })
      },[]);

    /**
     * 数量変更時
     * @param event 
     * @param i 
     * @param j 
     */
    const quantityChange = async(event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,i:number,j:number) => {
        if(categorys && categorys.length !== 0){
            let thisCategory = JSON.parse(JSON.stringify(location?.state?.categorys));
            thisCategory[i]["items"][j]["cart"] = Number(event.target.value);
            try{
                await categorysUpdate(thisCategory);
                setCategorys(thisCategory);
            } catch(error:any){
                throw new Error(error.message);
            }
        }
    }

    /**
     * カテゴリー一覧を更新する。
     * @param categorys カテゴリー一覧
     */
    const categorysUpdate = async(categorys:Categorys) => {
    axios.post("http://localhost:3004/categorys/update",categorys)
        .then((res:AxiosResponse) => {
            //HTTPレスポンスが200
            if(res.status !== HttpStatusCode.Ok){
                throw new Error("レスポンスが異常です。");
            }
            //画面上のカテゴリー一覧を更新
            console.info(res);
        })
        .catch((error:AxiosError) => {
            console.error(error);
        })
    }

    /**
     * 小計を計算する。
     * @param categorys カテゴリー一覧
     */
    const calSubtotals = (categorys:Categorys[]) => {
        let subTotals = 0;
        for(let category of categorys){
            let items:CategorysItems[] = category.items;
            for(let item of items){
                if(0 < item.cart){
                    subTotals += item.cart;
                }                
            }
        }
        setSubtotals(subTotals);
    }

    /**
     * 合計を計算する。
     * @param categorys カテゴリー一覧
     */
    const calTotal = (categorys:Categorys[]) => {
        let total = 0;
        for(let category of categorys){
            let items:CategorysItems[] = category.items;
            for(let item of items){
                if(item.cart < 1){
                    total += item.cart * item.price;
                }
            }
        }
        setTotal(total);        
    }

    return(
        <div>
            <Header title="Electric Commerce" categorys={categorys}/>  

            <Card>
                <CardHeader title="Cart"></CardHeader>
            {
                categorys.map((category:any,index:number) => {
                    return(
                        <div key={index}>
                                {
                                    category?.items && category.items.map((item:any,j:number) => {
                                        if(0 < item.cart){
                                            return(
                                                <Card key={j}>
                                                    <CardContent style={{display:"flex",justifyContent:"space-around"}}>
                                                        <img src={item.image} />
                                                        <p>{item.productname}</p>
                                                        <div>
                                                            <p>{item.price}円</p>
                                                            <div style={{display:"flex"}}>
                                                                <p>数量:</p>
                                                                <TextField 
                                                                   type="number"
                                                                   InputProps={{ inputProps: { min: 1} }}
                                                                   value={item.cart}
                                                                   onChange={((event) => quantityChange(event,index,j))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        }
                                    })
                                }
                        </div>
                    )
                })
            }
            </Card>

            <Card>
                <p>小計:{subTotals}</p>
                <p>合計:{total}</p>
            </Card>
        </div>
    )  
}


export default CartPage;
