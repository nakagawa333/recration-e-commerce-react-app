import Alert, { AlertColor } from "@mui/material/Alert"
import Snackbar, { SnackbarCloseReason, SnackbarOrigin } from "@mui/material/Snackbar"

type Props = {
    message:string,
    autoHideDuration:number,
    severity:AlertColor | undefined,
    snackbarOrigin:SnackbarOrigin
    openFlag:boolean,
    setOpenFlag:any
}

//通知スナックバー
function PushSnackbar(props:Props){
    
    /**
     * snackbars終了処理
     * @param event イベント
     * @param reason 終了理由
     */
    const pushSnackbarClose = (event: React.SyntheticEvent<any> | Event, reason: SnackbarCloseReason) => {
        props.setOpenFlag(false);
    }

    return(
        <div>
            <Snackbar
             anchorOrigin={{ vertical:props.snackbarOrigin.vertical, horizontal:props.snackbarOrigin.horizontal }}
             open={props.openFlag} 
             autoHideDuration={props.autoHideDuration}
             onClose={pushSnackbarClose}
             >
                <Alert severity={props.severity} sx={{ width: '100%' }}>
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default PushSnackbar;