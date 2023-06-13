import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useLayoutEffect, useState } from "react";
import { Categorys } from "./interface/categorys";
import { CategorysItems } from "./interface/categorysItems";
import Header from "./Header";


function FavoriteItems(){
    const title = "Electric Commerce";
    //カテゴリー一覧
    const [categorys,setCategorys] = useState([]);

    useLayoutEffect(() => {
        axios.get("http://localhost:3004/categorys/register")
        .then((res:AxiosResponse) => {
          //HTTPレスポンスが200
          if(res.status === HttpStatusCode.Ok){
            let categorys = res.data;
            //カテゴリー一覧を最新化
            setCategorys(categorys);
          }
          console.info(res);
        })
        .catch((error:AxiosError) => {
          console.error(error);
        })
      },[]);

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
    
    return (
        <div>
            <Header title={title} categorys={categorys}/>  

            <Box
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                marginTop={"30px"}
            >
                <Grid container alignItems="center">
                  <Grid item xs={12} md={10}>
                    <Card>
                                <CardHeader title="Favorite Items"></CardHeader>
                                {
                                    categorys && categorys.length !== 0 && categorys.map((category:Categorys,index:number) => {
                                        return(
                                            <div key={index}>
                                                { category?.items && category.items.map((item:CategorysItems,j:number) => {
                                                    if(item.favorite){
                                                        return(
                                                            <CardContent key={j} style={{display:"flex",justifyContent:"space-around"}}>
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

export default FavoriteItems;