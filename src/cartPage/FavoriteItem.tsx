import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import Box from "@mui/material/Box";
import { Categorys } from '../interface/categorys';
import { CategorysItems } from '../interface/categorysItems';


type Props = {
    categorys:Categorys[]
    deleteFavorite:(i:number,j:number) => void
    favoriteTrans: () => void
    cartAddClick: (event:React.MouseEvent<HTMLElement>,itemId:string,item:CategorysItems) => void
}

function FavoriteItem(props:Props){
    return(
        <>
            <Box
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                marginTop={"30px"}
            >
                <Grid container alignItems="center">
                        <Grid item xs={12} md={10}>
                            <Card>
                                <CardHeader title="Favorite Items" onClick={props.favoriteTrans}></CardHeader>
                                {
                                    props.categorys && props.categorys.length !== 0 && props.categorys.map((category:Categorys,index:number) => {
                                        return(
                                            <div key={index}>
                                                { category?.items && category.items.map((item:CategorysItems,j:number) => {
                                                    if(item.favorite){
                                                        return(
                                                            <CardContent style={{display:"flex",justifyContent:"space-around"}} key={j}>
                                                                <img width="300"  height="250" src={item.image} />
                                                                <p>{item.productname}</p>
                                                                <div>
                                                                    <p>{item.price}円</p>
                                                                    <p onClick={((e) => props.cartAddClick(e,item.itemId,item))}>カートに追加する</p>
                                                                    <p onClick={(() => props.deleteFavorite(index,j))}>お気に入りから削除する</p>
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
        </>
    )
}

export default FavoriteItem