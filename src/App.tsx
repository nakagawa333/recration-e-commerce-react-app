import React, { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import { NumericLiteral } from 'typescript';
import Header from './Header';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { Categorys } from './interface/categorys';
import { CartInfo } from './interface/cartInfo';
import { CategorysItems } from './interface/categorysItems';

function App() {
  //カテゴリー一覧
  const [categorys,setCategorys]:any = useState([])
  //カート情報
  const [cartInfo,setCartInfo]:any = useState({});
  const title:string="Electric Commerce";
  const categoryComponent:string = "Category Component";

  useLayoutEffect(() => {
    axios.get("http://localhost:3004/categorys/register")
    .then((res:AxiosResponse) => {
      //HTTPレスポンスが200以外
      if(res.status !== HttpStatusCode.Ok){
        console.error(res);
        return;
      }

      setCategorys(res.data);
      console.info("カテゴリー情報",res);
    })
    .catch((error:AxiosError) => {
      console.error(error);
    })
    .catch((error:any) => {
      console.error(error);
      console.error("失敗しました");
    })

    axios.get("http://localhost:3004/cart/info")
    .then((res:AxiosResponse) => {
      //HTTPレスポンスが200以外
      if(res.status !== HttpStatusCode.Ok){
        console.error(res);
        return;
      }

      setCartInfo(res.data.cartInfo);
      console.info("カート情報",res);
    })
    .catch((error:AxiosError) => {
      console.error(error);
    })
    .catch((error:any) => {
      console.error(error);
      console.error("失敗しました");
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
      if(res.status === HttpStatusCode.Ok){
        setCategorys(categorys);
      }
      console.info(res);
    })
    .catch((error:AxiosError) => {
      console.error(error);
    })
  }

  /**
   * カート情報を更新する
   * @param cartInfo カート情報
   */
  const cartInfoUpdate = async(cartInfo:CartInfo) => {
    axios.post("http://localhost:3004/cart/update",cartInfo)
    .then((res:AxiosResponse) => {
      //HTTPレスポンスが200以外
      if(res.status !== HttpStatusCode.Ok){
        console.error(res);
        return;
      }
      console.info(res);
    })
    .catch((error:AxiosError) => {
      console.error(error);
      console.error(error.message);
      throw new AxiosError(error.message);
    })
    .catch((error:any) => {
      console.error(error);
      throw new Error("予期せぬエラーが発生しました");
    })
  }

  /**
   * お気に入りクリック時
   * @param event クリックイベント
   * @param i
   * @param j
   */
  const favoriteClick = async(event:React.MouseEvent<HTMLElement>,i:number,j:number) => {
    let thisCategory = JSON.parse(JSON.stringify(categorys));
    thisCategory[i]["items"][j]["favorite"] = !thisCategory[i]["items"][j]["favorite"];
    await categorysUpdate(thisCategory);
  }

  /**
   * カートアイコンクリックイベント
   * @param event クリックイベント
   * @param itemId アイテムid
   * @param item 商品情報
   */
  const cartClick = async(event:React.MouseEvent<HTMLElement>,itemId:string,item:CategorysItems) => {
    let thisCartInfo:CartInfo = JSON.parse(JSON.stringify(cartInfo));
    let thisCartInfoItem:any = thisCartInfo[itemId];
    //既にカート済みの場合
    if(thisCartInfoItem){
      thisCartInfoItem.cart = thisCartInfoItem.cart + 1;
    } else {
      thisCartInfo[itemId] = {
        itemId:itemId,
        image:item.image,
        productname:item.productname,
        price:item.price,
        favorite:item.favorite,
        cart:1
      };
    }

    try{
      //カート情報更新
      await cartInfoUpdate(thisCartInfo);
      setCartInfo(thisCartInfo);
    } catch(error:any){
      console.error(error);
    }
    
  }

  return (
    <div>
      <Header title={title} categorys={categorys}/>  

      <div>
        <Select>
          <option>hello</option>
        </Select>

        <Select>
         <option>こんにちは</option>
        </Select>

      </div>
      {categorys && categorys.map((category:any,i:number) => {
        return(
          <div key={i}>
            <p className="category-component-card">{categoryComponent}</p>

            <Card className="category-component-card" style={{width:"90%"}}>
              <p>{category.terminal}</p>
              <div className="cards" >
                {
                  category?.items && category.items.map((item:CategorysItems,j:number) => {
                    return(
                      <Card key={j}>
                          <img src={item.image} className="card-item-img"/>
                          <CardContent>
                            <p>{item.productname}</p>
                            <p className="text-right">{item.price}円～</p>
                            <div style={{display:"flex"}}>
                              <div onClick={(event) => favoriteClick(event,i,j)}>
                                {
                                  item.favorite
                                  ? <FavoriteIcon htmlColor="#FFC0CB"/>
                                  : <FavoriteIcon />
                                }
                              </div>
                              <div onClick={(event) => cartClick(event,item.itemId,item)}>
                                <ShoppingCartIcon />
                              </div>
                            </div>
                          </CardContent>
                      </Card>
                    )
                  })
                }
              </div>
            </Card>

          </div>
        )
      })}
    </div>
  );
}

export default App;
