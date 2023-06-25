import Card from "@mui/material/Card";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import CardHeader from '@mui/material/CardHeader';
import { AlertColor, Button, CardContent, Select, SnackbarOrigin, TextField } from "@mui/material";
import { Categorys } from "../interface/categorys";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { Dispatch, SetStateAction, useLayoutEffect, useMemo, useState } from "react";
import Header from "../Header";
import { CategorysItems } from "../interface/categorysItems";
import { Grid } from '@mui/material';
import Box from "@mui/material/Box";
import { Path } from "../constant/path";
import { CartInfo } from "../interface/cartInfo";
import CartLook from "./CartLook";
import { isNoSubstitutionTemplateLiteral } from "typescript";
import PushSnackbar from "../snackbar/PushSnackbar";
import CartRes from "./CartRes";
import FavoriteItem from "./FavoriteItem";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
/**
 * カートページ画面
 * @returns jsx
 */
function CartPage(){
    const location = useLocation();
    const navigate:NavigateFunction = useNavigate();

    //snackbarメッセージ
    const [snackbarMessage,setSnackbarMessage] = useState<string>("");
    //snackbar 表示フラグ
    const [snackbarOpenFlag,setSnackbarOpenFlag] = useState<boolean>(false);
    
    //カテゴリー一覧
    const [categorys,setCategorys] = useState<Categorys[]>([]);
    //カート一覧
    const [cartInfo,setCartInfo] = useState<CartInfo>({});
    //小計
    const [subTotals,setSubtotals] = useState<number>(0);
    //合計
    const [total,setTotal] = useState<number>(0);

    const snackbarOrigin:SnackbarOrigin = {
        vertical:"top",
        horizontal:"center"
    }

    const severity:AlertColor = "success";
    const autoHideDuration:number = 6000;

    useLayoutEffect(() => {
        categoryRegister();
        getCartInfo();
    },[]);


    /**
     * カテゴリー取得
     */
    const categoryRegister = async() => {
        try{
            let axiosRes:AxiosResponse = await axios.get("http://localhost:3004/categorys/register");
            if(axiosRes.status !== HttpStatusCode.Ok){
                console.error("カート情報取得",axiosRes);
                return;
            }

            let categorys = axiosRes.data;
            //カテゴリー一覧を最新化
            setCategorys(categorys);
            console.info("カテゴリー情報取得",axiosRes);            
        } catch(error:any){
            console.error(error);
        }
    }

    /**
     * カート情報を取得する
     */
    const getCartInfo = async() => {
        try{
            let axiosRes:AxiosResponse = await axios.get("http://localhost:3004/cart/info");
            if(axiosRes.status !== HttpStatusCode.Ok){
                console.error("カート情報取得",axiosRes);
                return;
            }
            let cartInfo:CartInfo = axiosRes.data?.cartInfo;
            //カート一覧
            setCartInfo(cartInfo);
            //小計を計算する
            calSubtotals(cartInfo);
            //合計を計算する
            calTotal(cartInfo);
            console.info("カート情報取得",axiosRes);

        } catch(error:any){
            console.error(error);
            console.error(error.message);
        }
    }  

    /**
     * 数量変更時
     * @param event 
     * @param i 
     * @param j 
     */
    const quantityChange = async(event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,itemId:string) => {
        let thisCartInfo = JSON.parse(JSON.stringify(cartInfo));
        if(thisCartInfo && Object.keys(thisCartInfo).length !== 0){
            thisCartInfo[itemId]["cart"] = Number(event.target.value);
            try{
                cartInfoUpdate(thisCartInfo);
                //カート情報を更新する
                setCartInfo(thisCartInfo);
                //小計を計算する
                calSubtotals(thisCartInfo);
                //合計を計算する
                calTotal(thisCartInfo);
            } catch(error:any){
                throw new Error(error.message);
            }
        }
    }

    /**
     * カテゴリー情報を更新する
     * @param categorys カテゴリー一覧
     */
    const categorysUpdate = async(categorys:Categorys[]) => {
        try{
            let axiosRes:AxiosResponse = await axios.post("http://localhost:3004/categorys/update",categorys);
             //HTTPレスポンスが200以外
             if(axiosRes.status !== HttpStatusCode.Ok){
                console.error(axiosRes);
                return;
            }           

            console.info("カテゴリー更新",axiosRes);
        } catch(error:any){
            console.error(error);
        }
    }

    /**
     * カート情報を更新する
     * @param cartInfo カート情報
     */
    const cartInfoUpdate = async(cartInfo:CartInfo) => {
        let axiosRes:AxiosResponse = await axios.post("http://localhost:3004/cart/update",cartInfo);
        try{
            //HTTPレスポンスが200
            if(axiosRes.status !== HttpStatusCode.Ok){
                console.error(axiosRes);
                return;
            }
            console.info("カート情報更新",axiosRes);            
        } catch(error){
            console.error(error);
        }
    }

    /**
     * 小計を計算する。
     * @param categorys カテゴリー一覧
     */
    const calSubtotals = (cartInfo:CartInfo) => {
        let subTotals:number = 0;
        Object.keys(cartInfo).forEach((cart:any) => {
            subTotals += cartInfo[cart].cart;
        })
        setSubtotals(subTotals);
    }

    /**
     * 合計を計算する。
     * @param categorys カテゴリー一覧
     */
    const calTotal = (cartInfo:CartInfo) => {
        let total = 0;
        Object.keys(cartInfo).forEach((cart:any) => {
            total += cartInfo[cart].cart * cartInfo[cart].price;
        })
        setTotal(total);        
    }

    /**
     * お気に入りから削除する
     * @param i 
     * @param j 
     */
    const deleteFavorite = (i:number,j:number) => {
        let thisCategorys:Categorys[] = JSON.parse(JSON.stringify(categorys));
        thisCategorys[i]["items"][j]["favorite"] = false;

        try{
            categorysUpdate(thisCategorys);
            setCategorys(thisCategorys);
        } catch(error:any){
            throw new Error(error.message);
        }
    }

    /**
     * 購入するクリック時
     */
    const purchaseClick = async() => {
        // TODO 初期化処理 後で処理内容は要検討
        let axiosRes:AxiosResponse = await axios.post("http://localhost:3004" + "/cart/init");
        //HTTPレスポンスが200以外
        if(axiosRes.status !== HttpStatusCode.Ok){
            console.error(axiosRes);
            return;
        }

        setSnackbarMessage("購入出来ました");
        setSnackbarOpenFlag(true);
        //カート情報取得
        getCartInfo();
    }

    /**
     * カートから削除する
     * @param itemId アイテムid
     */
    const deleteFromCart = async(itemId:string) => {
        let thisCartInfo:CartInfo = JSON.parse(JSON.stringify(cartInfo));
        delete thisCartInfo[itemId];
        
        await cartInfoUpdate(thisCartInfo);
        await getCartInfo();
    }

  /**
   * カートに追加する クリックイベント
   * @param event クリックイベント
   * @param itemId アイテムid
   * @param item 商品情報
   */
  const cartAddClick = async(event:React.MouseEvent<HTMLElement>,itemId:string,item:CategorysItems) => {
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
        await getCartInfo();
    } catch(error:any){
        console.error(error);
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
            <PushSnackbar 
              message={snackbarMessage}
              autoHideDuration={autoHideDuration}
              severity={severity}
              snackbarOrigin={snackbarOrigin}
              openFlag={snackbarOpenFlag}
              setOpenFlag={setSnackbarOpenFlag}
            />
            <Grid container rowSpacing={4} columnSpacing={{xs: 1, sm: 2, md: 3 }}>
                <CartLook 
                  cartInfo={cartInfo} 
                  quantityChange={quantityChange}
                  deleteFromCart={deleteFromCart}
                />
                <CartRes 
                  subTotals={subTotals}
                  total={total}
                  purchaseClick={purchaseClick}
                />
            </Grid>

            <FavoriteItem
              categorys={categorys}
              deleteFavorite={deleteFavorite}
              favoriteTrans={favoriteTrans}
              cartAddClick={cartAddClick}
            />
        </div>
    )  
}


export default CartPage;
