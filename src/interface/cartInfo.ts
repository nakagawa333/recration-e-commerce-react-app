export interface CartInfo{
    [itemId: string]:{
        itemId:string,
        image:string,
        productname:string,
        price:number,
        favorite:boolean,
        cart:number
    }
}