import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

type Props = {
    //小計
    subTotals:number,
    //合計
    total:number,
    // 購入するクリックイベント
    purchaseClick:any
}

function CartRes(props:Props){
    return(
        <>
            <Grid item xs={4} md={4}>
                <Card>
                    <p>小計:{props.subTotals}</p>
                    <p>合計:{props.total}</p>
                    <Button variant="contained" onClick={props.purchaseClick}>購入する</Button>
                </Card>
            </Grid>            
        </>
    )
}

export default CartRes;