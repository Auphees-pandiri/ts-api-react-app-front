import React from "react";
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ApiClient from './Api/ApiClient';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import CardHeader from '@mui/material/CardHeader';
import Backdrop from '@mui/material/Backdrop';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';




function MyCart(props) {
  
  const [cartValues, setCartValues] = React.useState({});
  const [isRefreshProducts, setisRefreshProducts] = React.useState(false);
  
  const [deleteFromCartId, setDeleteFromCartId] = React.useState(null);

  let loggedInUser;
  if (sessionStorage.userdetails) {
    loggedInUser = JSON.parse(sessionStorage.userdetails);
  }

    const handleDeleteFromBag = async (subRecord)=> {
        setDeleteFromCartId(subRecord);
        const resp = await ApiClient.sendRequest("/api/sheetApi/delete-record", "POST", {}, {
            sheet_id: 14198916,
            delete_record_id : subRecord
        });
        if (resp.success) {
            props.setSnackbarData({
                isOpenSnackbar: true,
                snackbarMessage: "Product removed successfully from cart!",
                snackbarType: "success"
            });
        } else {
            props.setSnackbarData({
                isOpenSnackbar: true,
                snackbarMessage: resp.message,
                snackbarType: "error"
            });
        }
        setDeleteFromCartId(null);
        
        await refreshCartDetails(props.cartRecordId);
        
    }

    const handleQuantityChange = async (product, val) => {
        let modifiedProd = {}
        modifiedProd["2906"] = {
            "value": [
                {
                "2902": {"value" : JSON.stringify({"value": product["Product"], "reference_column_id": product["record_id"]}), "record_id": product["record_id"]},
                "2903": {"value" : val, "record_id": product["record_id"]},
                "2911": {"value" : JSON.stringify({"value": product["Product Price"], "reference_column_id": product["record_id"]}), "record_id": product["record_id"]}
                }
            ],
            "record_id": props.cartRecordId,
            "sub_list_id": "14198916"
        };
        console.log(modifiedProd)
        const resp = await ApiClient.sendRequest("/api/sheetApi/update-record", "POST", {}, {
            sheet_id: 34070233,
            data : modifiedProd
          });
        
        await refreshCartDetails(props.cartRecordId);
      }

    const refreshCartDetails = async (fetchRecordId) => {
        setisRefreshProducts(true);
        const cartRecordResp = await ApiClient.sendRequest("/api/sheetApi/fetch-record", "POST", {}, {
            sheet_id: 34070233,
            record_id: fetchRecordId ?? props.cartRecordId
          });
        if(cartRecordResp.success) {
            props.setBagDetails(cartRecordResp.data);
            //formatValuesData();
        }
        setisRefreshProducts(false);
    }

    const fetchCartDetails = async () => {
        console.log("fetching cart details")
        const sheetColumnsResp = await ApiClient.sendRequest("/api/sheetApi/get-sheet-columns", "POST", {}, {
            sheet_id: 34070233
          });
        if (sheetColumnsResp.success) {
            props.setCartColumnsData(sheetColumnsResp.data);
        }
        const userIdColumn = sheetColumnsResp.data.filter(col => col["name"] == 'User Id');
        let userIdColumn_id;
        if (userIdColumn){
            userIdColumn_id = userIdColumn[0]["column_id"];
        }
        let loggedInUserId = loggedInUser["record_id"];
        const allRecordsResp = await ApiClient.sendRequest("/api/sheetApi/get-records", "POST", {}, {
            sheet_id: 34070233,
            limit: 1,
            criteria: "sheet_34070233.column_" + userIdColumn_id + " = " + loggedInUserId
          });
        let fetchRecordId;
        if (allRecordsResp.success) {
            fetchRecordId = allRecordsResp.data[0]["record_id"];
            props.setCartRecordId(fetchRecordId);
            
        }
        refreshCartDetails(fetchRecordId);
        // const cartRecordResp = await ApiClient.sendRequest("/api/sheetApi/fetch-record", "POST", {}, {
        //     sheet_id: 34070233,
        //     record_id: fetchRecordId
        //   });
        // if(cartRecordResp.success) {
        //     props.setBagDetails(cartRecordResp.data);
        //     //formatValuesData();
        // }
    }

    const formatValuesData = () => {
        let tempCartValues = {};
        props.cartColumnsData.forEach((col) => {
            if(col.default_type != "1") {
                if(col.column_type_id == 6) {
                    if (props.bagDetails && props.bagDetails[col.name] && props.bagDetails[col.name].length > 0) {
                        let subsheetVals = [];
                        let subsheetRecords = props.bagDetails[col.name];
                        let subSheetCols = col.list_columns;
                        subsheetRecords.forEach((subRec, subRecIndex) => {
                            let subsheetFormattedRec = {};
                            subSheetCols.forEach((subsheetCol, subIndex) => {
                                if(subsheetCol.default_type != "1" && subsheetCol.name != "Total Price") {
                                    if (subsheetCol.column_type_id == "10") {
                                        subsheetFormattedRec[subsheetCol.column_id] = {"value" : JSON.stringify({"value": subRec[subsheetCol.name], "reference_column_id": subRec[subsheetCol.name+" reference_id"]}), "record_id" : subRec.record_id};
                                    } else {
                                        subsheetFormattedRec[subsheetCol.column_id] = {"value" : subRec[subsheetCol.name], "record_id" : subRec.record_id};
                                    }
                                }
                            });
                            subsheetVals.push(subsheetFormattedRec);
                        });
                        tempCartValues[col.column_id] = { "value" : subsheetVals, "sub_list_id": col.list_columns[0]["sheet_id"]}
                    }
                } 
                // else {
                //     tempCartValues[col.column_id] = {"value" : props.singleProductData[col.name], "record_id" : props.singleProductData.record_id}
                // }
            }
        });
        console.log(tempCartValues);
        setCartValues(tempCartValues);
    }



    React.useEffect(() => {
        console.log(props.cartColumnsData);
        if(props.cartColumnsData.length == 0) {
            fetchCartDetails();
        } else {
            refreshCartDetails(props.cartRecordId)
        }
        return () => {
        }
    }, [props.open]);

    // console.log(props.bagDetails);
 
    const title = "Total price (" + (props.bagDetails.Items ? props.bagDetails.Items.length : 0) + " items) : ";
    let TotalPrice = 0;
    if (props.bagDetails.Items) {
        props.bagDetails.Items.forEach((prod)=> {
            TotalPrice += parseInt(prod["Quantity"]) * parseInt(prod["Product Price"]);
        });
    }
    
  
    return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={props.open}
      onClose={() => {
        props.handleCloseCart();
    }}
    >
        <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isRefreshProducts}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
    <DialogTitle>
    <Grid container direction="row" style={{backgroundColor:"#ccc", padding: 10, alignItems: "center"}}>
        <Grid item xs={11}>
        <Typography variant="h5">
            {"Shopping cart"}
        </Typography>
        </Grid>

        <Grid item float="right">
        <IconButton
            edge="start"
            align="right"
            color="inherit"
            aria-label="Close"
            style={{ padding: 8 }}
            onClick = {()=> {
            props.handleCloseCart();
            }}
        >
            <CloseIcon />
        </IconButton>
        </Grid>

    </Grid>
    </DialogTitle>
      <DialogContent>
            <Grid container>
            <Grid container xs={8} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {
               props.bagDetails.Items && props.bagDetails.Items.map((product, index) =>
               <Grid key={index}item xs={12} >
               <Card sx={{ marginTop: 2, display: "flex"}}>
                    <CardHeader
                        // style={{backgroundColor:"#ccc", paddingTop: 6, paddingLeft: 16, paddingRight: 16, paddingBottom: 6}}
                        action={
                            <IconButton
                             onClick={()=>{
                                handleDeleteFromBag(product["record_id"])
                             }}
                            >
                            <CloseIcon style={{color: "#c9574f"}}/>
                            {
                                deleteFromCartId == product["record_id"] &&
                                <CircularProgress style={{width: 15, height:15, marginLeft: 5, color:"#c9574f"}} color="inherit" />
                                }
                            </IconButton>
                        }
                        // title={(index+1) + ") "+ product["Product"]}
                    />
                    <CardMedia
                        component="img"
                        height="150"
                        sx={{ width: "auto", maxWidth: "300px" }}
                        image={product["Product Image"] == "" ? "" : (JSON.parse(product["Product Image"]).length > 0 ? (JSON.parse(product["Product Image"])[0]["path"]) :"")}
                        alt="No Image available"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent style={{paddingTop: 10, paddingLeft: 16, paddingRight: 16, paddingBottom: 5}}>
                        <Typography variant="h6" color="text.secondary" component="div">
                            {product["Product"]} 
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {product["Category"]}
                        </Typography>
                        <Typography>
                        {"Product Price :" + product["Product Price"]} {'Rs'}
                        </Typography>
                        {/* <Typography variant="h6" color="text.secondary" component="div">
                            {product["Price"]} {'Rs'}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {product["Category"]}
                        </Typography> */}
                        {/* { product["Available Quantity"] < 30 &&
                        <Typography variant="body2">
                            Only {product["Available Quantity"]} 
                            {' are available. Hurry up!'}
                        </Typography>
                        
                        } */}
                        <Grid container style={{ alignItems:"center", marginTop: 5, marginBottom: 5}}>
                        <Typography style={{marginRight: 10}}>
                        {"Quantity:"}
                        </Typography>
                        <TextField
                            type="number"
                            margin="dense"
                            variant="outlined"
                            value = {product["Quantity"]}
                            onChange = {(e) => {
                                handleQuantityChange(product, e.target.value);
                                // updateValues(col.column_id, e.target.value);
                                // const colId = col.column_id;
                                // let tempValues={};
                                // tempValues[colId] = {"value": e.target.value}
                                // tempValues = {...values, ...tempValues};
                                // setValues(tempValues)
                            }}
                        />
                        </Grid>
                    </CardContent>
                    </Box>
                    <CardActions style={{justifyContent: "flex-end", paddingTop: 2, paddingLeft: 16, paddingRight: 16, paddingBottom: 2}}>
                        <Typography color="text.secondary">
                        {"Sub total: "} <b>{parseInt(product["Quantity"]) * parseInt(product["Product Price"])}</b>
                        </Typography>
                    </CardActions>
                </Card>
               </Grid>
               ) 
            }
            </Grid>
            <Grid container xs={4} style= {{marginLeft: 20}}>
                <Grid item xs={12} >
                    <Card>
                        <CardContent>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {title} <b>{TotalPrice}</b>
                        </Typography>
                            
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            </Grid>
      </DialogContent>
      <DialogActions>
          <Button onClick={() => {props.handleCloseCart();}}>Close</Button>
          <Button 
            onClick={async () => {
                await props.handlePlaceOrder();
                // await props.saveProduct(values, props.isEditProduct);
            }}
            >
            Place Order 
            {/* {
                    props.addProductLoading &&
                    <CircularProgress style={{width: 20, height:20}} color="inherit" />
                } */}
            </Button>
        </DialogActions>
    </Dialog>
  );
}

export default MyCart;
