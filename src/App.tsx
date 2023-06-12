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

function App() {
  const [categorys,setCategorys]:any = useState([])

  const title="Electric Commerce";
  const categoryComponent = "Category Component";

  useLayoutEffect(() => {
    axios.get("http://localhost:3004/categorys/register")
    .then((res:AxiosResponse) => {
      //HTTPレスポンスが200
      if(res.status === HttpStatusCode.Ok){
        setCategorys(res.data);
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
   * カートクリック時
   * @param event クリックイベント
   * @param i 
   * @param j 
   */
  const cartClick = async(event:React.MouseEvent<HTMLElement>,i:number,j:number) => {
    let thisCategory = JSON.parse(JSON.stringify(categorys));
    let cart = thisCategory[i]["items"][j]["cart"];
    thisCategory[i]["items"][j]["cart"] = cart + 1;
    await categorysUpdate(thisCategory);   
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
                  category?.items && category.items.map((item:any,j:number) => {
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
                              <div onClick={(event) => cartClick(event,i,j)}>
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
