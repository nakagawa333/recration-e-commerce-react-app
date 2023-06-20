import { ChangeEvent, useLayoutEffect } from "react";
import { CartInfo } from "../interface/cartInfo";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Button, TextField } from "@mui/material";

interface Props{
    cartInfo:CartInfo,
    quantityChange:((event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,itemId:string) => {}),
    deleteFromCart:(itemId:string) => void
}

/** 
 * カート情報一覧
 * @param props プロップス
 * @returns jsx
 */
function CartLook(props:Props){
    let cartInfo:CartInfo = props.cartInfo
    let cartInfoKeys:string[] = Object.keys(props.cartInfo);
    return(
        <>
            <Grid item xs={8} md={8}>
                <Card>
                    <CardHeader title="Cart"></CardHeader>
                    {props.cartInfo && cartInfoKeys.map((itemId:string,index:number) => {
                        return(
                            <div key={index}>
                                {
                                    <CardContent style={{display:"flex",justifyContent:"space-around"}}>
                                        <img width="300"  height="250" src={cartInfo[itemId].image} />
                                        <p>{cartInfo[itemId].productname}</p>
                                        <div>
                                            <p>{cartInfo[itemId].price}円</p>
                                            <div style={{display:"flex"}}>
                                                <p>数量:</p>
                                                <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 1} }}
                                                onChange={((e) => props.quantityChange(e,itemId))}
                                                value={cartInfo[itemId].cart}
                                                >

                                                </TextField>
                                            </div>
                                            <p onClick={() => props.deleteFromCart(itemId)}>カートから削除する</p>
                                        </div>
                                    </CardContent>
                                }
                            </div>
                        )
                    })}
                </Card>
            </Grid>
        </>
    )
}

export default CartLook;