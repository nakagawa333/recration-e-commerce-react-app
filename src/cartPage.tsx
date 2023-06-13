import Card from "@mui/material/Card";
import { useLocation, useNavigate } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import { Button, CardContent, Select, TextField } from "@mui/material";
import { Categorys } from "./interface/categorys";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useLayoutEffect, useState } from "react";
import Header from "./Header";
import { CategorysItems } from "./interface/categorysItems";
import { Grid } from '@mui/material';
import Box from "@mui/material/Box";
import { Path } from "./constant/path";

/**
 * カートページ画面
 * @returns jsx
 */
function CartPage(){
    const location = useLocation();
    const navigate = useNavigate();
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
            let thisCategorys = JSON.parse(JSON.stringify(categorys));
            thisCategorys[i]["items"][j]["cart"] = Number(event.target.value);
            try{
                await categorysUpdate(thisCategorys);
                setCategorys(thisCategorys);
                //小計を計算する
                calSubtotals(thisCategorys);
                //合計を計算する
                calTotal(thisCategorys);
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
                if(0 < item.cart){
                    total += item.cart * item.price;
                }
            }
        }
        setTotal(total);        
    }

    /**
     * お気に入りから削除する
     * @param i 
     * @param j 
     */
    const deleteFavorite = async(i:number,j:number) => {
        let thisCategorys = JSON.parse(JSON.stringify(categorys));
        thisCategorys[i]["items"][j]["favorite"] = false;

        try{
            await categorysUpdate(thisCategorys);
            setCategorys(thisCategorys);
        } catch(error:any){
            throw new Error(error.message);
        }
    }

    /**
     * favorite Itemsページに遷移する。
     */
    const favoriteTrans = () => {
        navigate(Path.FAVORIEITEMS);
    }

    return(
        <div>
            <Header title="Electric Commerce" categorys={categorys}/>  

            <Grid container rowSpacing={4} columnSpacing={{xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={8} md={8}>
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
                                                                <img width="300"  height="250" src={item.image} />
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
                </Grid>

                <Grid item xs={4} md={4}>
                    <Card>
                        <p>小計:{subTotals}</p>
                        <p>合計:{total}</p>
                        <Button variant="contained">購入する</Button>
                    </Card>
                </Grid>
            </Grid>
            
            <Box
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                marginTop={"30px"}
            >
                <Grid container alignItems="center">
                        <Grid item xs={12} md={10}>
                            <Card>
                                <CardHeader title="Favorite Items" onClick={favoriteTrans}></CardHeader>
                                {
                                    categorys && categorys.length !== 0 && categorys.map((category:Categorys,index:number) => {
                                        return(
                                            <div key={index}>
                                                { category?.items && category.items.map((item:CategorysItems,j:number) => {
                                                    if(item.favorite){
                                                        return(
                                                            <CardContent style={{display:"flex",justifyContent:"space-around"}}>
                                                                <img width="300"  height="250" src={item.image} />
                                                                <p>{item.productname}</p>
                                                                <div>
                                                                    <p>{item.price}円</p>
                                                                    <p>カートに追加する</p>
                                                                    <p onClick={(() => deleteFavorite(index,j))}>お気に入りから削除する</p>
                                                                </div>
                                                            </CardContent>
                                                        )
                                                    }
                                                })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </Card>
                        </Grid>
                </Grid>

            </Box>
        </div>
    )  
}


export default CartPage;
