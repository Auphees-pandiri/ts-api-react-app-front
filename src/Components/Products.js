import * as React from 'react';
import ApiClient from './Api/ApiClient';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Popover from '@mui/material/Popover';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IconButton from "@mui/material/IconButton";
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import CardHeader from '@mui/material/CardHeader';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Products(props) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [productInfo, setProductInfo] = React.useState([]);
    const [loadingRecordId, setLoadingRecordId] = React.useState(null);

    const fetchAllRecords = async () => {
    // const resp1 = await ApiClient.sendRequest("/login/validate-login?email=apheespandiri123@gmail.com&password=aphees", "GET", {}, {});
        const resp = await ApiClient.sendRequest("/api/sheetApi/get-records", "POST", {}, {
            sheet_id: 45364008
          });
        if (resp.success) {
            props.setProductsData(resp.data);
            setIsLoading(false);
        }
    };
    let loggedInUser;
    if (sessionStorage.userdetails) {
        loggedInUser = JSON.parse(sessionStorage.userdetails);
    }

    React.useEffect(() => {
        fetchAllRecords();
    }, [props.updateProducts]);
    
    const fetchProductData = async (sheetId, recordId, currentTarget) => {
        setLoadingRecordId(recordId);
        const resp = await ApiClient.sendRequest("/api/sheetApi/fetch-record", "POST", {}, {
            sheet_id: sheetId,
            record_id: recordId
          });
        if (resp.success) {
            setAnchorEl(currentTarget);
            setProductInfo(resp.data);
        }
        setLoadingRecordId(null);
    }

    if(props.productsData.length == 0 && isLoading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
//   console.log(productInfo.length);
//   console.log(props.selectedRecords);
//     console.log(props.selectedRecords.indexOf(props.productsData[0]["record_id"]));
    return (
    <>
        <div className="App">
            <h1>Products <span style = {{color:"blue"}}>{props.productsData.length}</span></h1> 
        </div>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            
            {
               props.productsData.map((product, index) =>
               <Grid key={index}item xs={3}>
               <Card sx={{ minWidth: 275, opacity: props.selectedRecords.indexOf(product["record_id"]) >= 0 ? 0.6 : 1, backgroundColor: props.selectedRecords.indexOf(product["record_id"]) >= 0 && "#ededed" }}>
                    <CardHeader
                        action={(loggedInUser && loggedInUser["Is Admin"] == "1") ?
                            <Checkbox 
                            checked={props.selectedRecords.indexOf(product["record_id"]) >= 0}
                            onClick = {(event)=> {
                                let recIndex = props.selectedRecords.indexOf(product["record_id"]);
                                // console.log(recIndex)
                                if(recIndex < 0) {
                                    let records = [...props.selectedRecords, product["record_id"]];
                                    props.setSelectedRecords(records);
                                } else {
                                    // let records = props.selectedRecords;
                                    // records.splice(recIndex, 1);
                                    // console.log(records)
                                    // props.setSelectedRecords(records);
                                    props.setSelectedRecords(
                                        props.selectedRecords.filter(selRec =>
                                          selRec != product["record_id"]
                                        )
                                      );
                                }
                            }} 
                            /> : <></>
                        }
                        title={product["Product Name"]}
                    />
                    <CardMedia
                        component="img"
                        height="200"
                        image={JSON.parse(product["Image"]).length > 0 ? JSON.parse(product["Image"])[0]["path"] :""}
                        alt="No Image"
                    />
                    <CardContent>
                        {/* <Typography variant="h5">
                            {product["Product Name"]}
                        </Typography> */}
                        <Typography variant="h6" color="text.secondary" component="div">
                            {product["Price"]} {'Rs'}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {product["Category"]}
                        </Typography>
                        {/* { product["Available Quantity"] < 30 &&
                        <Typography variant="body2">
                            Only {product["Available Quantity"]} 
                            {' are available. Hurry up!'}
                        </Typography>
                        
                        } */}
                    </CardContent>
                    <CardActions>
                        <>
                        <Button 
                        size="small" 
                        onClick = {async (event) => {
                            await fetchProductData(45364008,product["record_id"], event.currentTarget);
                            // console.log("hello");
                            
                          }}
                        >
                            View Details {
                                loadingRecordId == product["record_id"] &&
                                <CircularProgress style={{width: 20, height:20, marginLeft: 5}} color="inherit" />
                            }
                        </Button>
                        <Button 
                            size="small"
                            onClick = {async (event) => {
                                props.hanldleAddtoBag(product);
                            }}
                        >
                            Add to Bag
                            {
                                props.addtobagLoadingId == product["record_id"] &&
                                <CircularProgress style={{width: 15, height:15, marginLeft: 5}} color="inherit" />
                            }
                        </Button>
                        </>
                        {(loggedInUser && loggedInUser["Is Admin"] == "1") &&
                        <>
                            <Tooltip title="Edit product">
                            <IconButton
                                edge="start"
                                align="right"
                                color="inherit"
                                aria-label="Close"
                                style={{ padding: 8 }}
                                onClick = {async ()=> {
                                    const resp = await ApiClient.sendRequest("/api/sheetApi/fetch-record", "POST", {}, {
                                        sheet_id: 45364008,
                                        record_id: product["record_id"]
                                      });
                                      props.setSingleProductData(resp.data);
                                      props.setIsEditProduct(true);
                                      props.setIsOpenAddProduct(true);
                                }}
                            >
                                <ModeEditIcon style={{color:"#1976d2"}}/>
                                {/* {
                                props.deleteProdLoadingId == product["record_id"] &&
                                <CircularProgress style={{width: 15, height:15, marginLeft: 5}} color="inherit" />
                                } */}
                            </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete product">
                            <IconButton
                                edge="start"
                                align="right"
                                color="inherit"
                                aria-label="Close"
                                style={{ padding: 8 }}
                                onClick = {()=> {
                                    props.handleDeleteProduct(product["record_id"]);
                                }}
                            >
                                <DeleteForeverIcon style={{color:"#c9574f"}} />
                                {
                                props.deleteProdLoadingId == product["record_id"] &&
                                <CircularProgress style={{width: 15, height:15, marginLeft: 5, color:"#c9574f"}} color="inherit" />
                                }
                            </IconButton>
                            </Tooltip>
                        </>
                        }
                    </CardActions>
                </Card>
               </Grid>
               ) 
            }
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
            setAnchorEl(null);
            // setProductInfo([]);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography>
                    Name: {productInfo["Product Name"]}
                </Typography>
                <Typography component="div">
                    Price: {productInfo["Price"]} {'Rs'}
                </Typography>
                <Typography>
                    Category: {productInfo["Category"]}
                </Typography>
                <Typography>
                    Status: {productInfo["status"]}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    Available Quantity: {productInfo["Available Quantity"]}
                </Typography>
                { productInfo.length > 0 &&
                <Typography>
                    Child Products: 
                    {productInfo["Child Products"].map((cp, index) =>
                        <div
                            style={{
                            margin: "8px 5px",
                            padding: "5px",
                            border: "2px solid #ebebeb",
                            borderRadius: "5px",
                            }}
                        >
                            <Typography>
                                Name: {cp["Product"]}
                            </Typography>
                            <Typography>
                                Quantity: {cp["CP quantity"]}
                            </Typography>

                        </div>
                    )}
                </Typography>
                
                }
            </CardContent>
        </Card>
      </Popover>
      </>
    );
  }
  
export default Products;