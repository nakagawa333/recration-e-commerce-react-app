import { ChangeEvent, useLayoutEffect } from "react";
import { CartInfo } from "../interface/cartInfo";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { TextField } from "@mui/material";

interface Props{
    cartInfo:any,
    quantityChange:((event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,itemId:string) => {})
}

/** 
 * カート情報一覧
 * @param props プロップス
 * @returns jsx
 */
function CartLook(props:Props){
    let cartInfo = props.cartInfo;
    let cartInfoKeys:string[] = Object.keys(props.cartInfo);
    return(
        <>
            <Grid item xs={8} md={8}>
                <Card>
                    <CardHeader title="Cart"></CardHeader>
                    {cartInfoKeys.length !== 0 && cartInfoKeys.map((cartInfoKey:string,index:number) => {
                        return(
                            <div key={index}>
                                {
                                    <CardContent style={{display:"flex",justifyContent:"space-around"}}>
                                        <img width="300"  height="250" src={cartInfo[cartInfoKey].itemId} />
                                        <p>{cartInfo[cartInfoKey].productname}</p>
                                        <div>
                                            <p>{cartInfo[cartInfoKey].price}円</p>
                                            <div style={{display:"flex"}}>
                                                <p>数量:</p>
                                                <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 1} }}
                                                onChange={((e) => props.quantityChange(e,cartInfoKey))}
                                                value={cartInfo[cartInfoKey].cart}
                                                >

                                                </TextField>
                                            </div>
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