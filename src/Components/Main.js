import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import BusinessIcon from '@mui/icons-material/Business';
import ApiClient from './Api/ApiClient';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

import Products from './Products';
import Orders from './Orders';
import Users from './Users';
import AddProduct from './AddProduct';
import MyCart from './MyCart';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const pages = ['Products', 'Orders'];
const settings = ['Profile', 'My cart', 'Logout'];

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [pageName, setPageName] = React.useState('Products');
  const [isOpenAddProduct, setIsOpenAddProduct] = React.useState(false);
  const [addProductLoading, setAddProductLoading] = React.useState(false);
  const [deleteProdLoadingId, setDeleteProdLoadingId] = React.useState(null);
  const [addtobagLoadingId, setAddtobagLoadingId] = React.useState(null);
  const [deleteSelectedRecordsLoading, setDeleteSelectedRecordsLoading] = React.useState(false);
  const [snackbarData, setSnackbarData] = React.useState({
    isOpenSnackbar: false,
    snackbarMessage: "",
    snackbarType: "info"
  });
  const [productsData, setProductsData] = React.useState([]);
  const [singleProductData, setSingleProductData] = React.useState(null);
  const [isEditProduct, setIsEditProduct] = React.useState(false);
  const [isMultipleEdit, setIsMultipleEdit] = React.useState(false);
  const [selectedRecords, setSelectedRecords] = React.useState([]);
  const [updateProducts, setupdateProducts] = React.useState(false);
  const [isOpenCart, setIsOpenCart] = React.useState(false);
  const [bagDetails, setBagDetails] = React.useState({});
  const [cartColumnsData, setCartColumnsData] = React.useState([]);
  const [cartRecordId, setCartRecordId] = React.useState(null);
  const navigate = useNavigate();

  let loggedInUser;
  if (sessionStorage.userdetails) {
    loggedInUser = JSON.parse(sessionStorage.userdetails);
  }
  console.log("object is ...");
  console.log(loggedInUser);
  if (!loggedInUser) {
    navigate('/login');
  }

  const handleCloseAddProduct = () => {
    setIsOpenAddProduct(false);
    setIsEditProduct(false);
    setSingleProductData(null);
    setIsMultipleEdit(false);
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseCart = () => {
    setIsOpenCart(false);
    handleCloseUserMenu();
  }

  const hanldleSettingsClick = (setting) => {
    if(setting == "My cart") {
        setIsOpenCart(true);
    } else if (setting == "Logout") {
      sessionStorage.removeItem('userdetails');
      navigate('/login');
    }
  }

  const handlePlaceOrder = async () => {
    // const cartDetails = await ApiClient.sendRequest("/api/sheetApi/fetch-record", "POST", {}, {
    //   sheet_id: 34070233,
    //   record_id : cartRecordId
    // });
    console.log(bagDetails);

  }


  const hanldleAddtoBag = async (product) => {
    console.log(cartColumnsData);
    console.log(product);
    setAddtobagLoadingId(product["record_id"]);
    let newProd = {}
    let Imagedata = product["Image"];
    // let newImagedata = {}
    // if (Imagedata != "") {
    //     Imagedata = JSON.parse(product["Image"]);
    //     if (Imagedata.length > 0) {
    //         newImagedata["name"] = Imagedata[0]["name"];
    //         newImagedata["uploaded_name"] = Imagedata[0]["uploaded_name"];
    //         newImagedata["path"] = Imagedata[0]["path"];
    //         newImagedata["size"] = Imagedata[0]["size"];
    //         newImagedata["status"] = Imagedata[0]["status"];
    //     }
    //     newImagedata = [newImagedata];
    //     console.log(newImagedata);
    // } else {
    //     newImagedata = "";
    // }
    console.log(loggedInUser);
    let mycartRecordId = cartRecordId;
    if (!cartRecordId) {
      newProd["2900"] = {"value":loggedInUser["record_id"],"column_type_id":"5","row_id":"","is_modified":true};
      newProd["2901"] = {"value":JSON.stringify({"value": loggedInUser["User name"], "reference_column_id": loggedInUser["record_id"]}),"column_type_id":"10","row_id":"","is_modified":true};
      newProd["2909"] = {"value":JSON.stringify({"value": loggedInUser["User email"], "reference_column_id": loggedInUser["record_id"]}),"column_type_id":"10","row_id":"","is_modified":true};
      newProd["2907"] = {"value":JSON.stringify({"value": loggedInUser["User address"], "reference_column_id": loggedInUser["record_id"]}),"column_type_id":"10","row_id":"","is_modified":true};
      newProd["2908"] = {"value":JSON.stringify({"value": loggedInUser["User phone no"], "reference_column_id": loggedInUser["record_id"]}),"column_type_id":"10","row_id":"","is_modified":true};
    
      newProd["2906"] = {
          "value": [
              {
              "2902": {"value" : JSON.stringify({"value": product["Product Name"], "reference_column_id": product["record_id"]})},
              "2903": {"value" : "1"},
              "2911": {"value" : JSON.stringify({"value": product["Price"], "reference_column_id": product["record_id"]})},
              // "2913": {"value" : JSON.stringify({"reference_column_id": product["record_id"], "value": Imagedata})}
              }

          ],
          "record_id": "",
          "sub_list_id": "14198916"
      };
      const resp = await ApiClient.sendRequest("/api/sheetApi/create-record", "POST", {}, {
        sheet_id: 34070233,
        data : newProd
      });
      setCartRecordId(resp.record.record_id);
      mycartRecordId = resp.record.record_id;
    } else {
      newProd["2906"] = {
        "value": [
            {
            "2902": {"value" : JSON.stringify({"value": product["Product Name"], "reference_column_id": product["record_id"]})},
            "2903": {"value" : "1"},
            "2911": {"value" : JSON.stringify({"value": product["Price"], "reference_column_id": product["record_id"]})},
            // "2913": {"value" : JSON.stringify({"reference_column_id": product["record_id"], "value": Imagedata})}
            }
        ],
        "record_id": cartRecordId,
        "sub_list_id": "14198916"
      };
      console.log(newProd)
      const resp = await ApiClient.sendRequest("/api/sheetApi/update-record", "POST", {}, {
          sheet_id: 34070233,
          data : newProd
        });
    }
    
    const resp2 = await ApiClient.sendRequest("/api/sheetApi/fetch-record", "POST", {}, {
      sheet_id: 34070233,
      record_id : mycartRecordId
    });
    let tempItem = resp2.data.Items.filter((item)=> item.Product == product["Product Name"]);
    console.log(tempItem);
    let recentRecordId = tempItem[0].record_id;
    console.log(recentRecordId);
    const lookupOptions = await ApiClient.sendRequest("/api/sheetApi/get-lookup-options", "POST", {}, {
      column_id: 2913,
      parent_sheet_id: 34070233,
      parent_record_id : mycartRecordId,
      parent_column_id: 2906,
      sub_record_id: recentRecordId
    });

    console.log(lookupOptions)
    let newImagedata = lookupOptions.data[0]["column_2912"];
    // newImagedata = JSON.parse(newImagedata);

    let newProd2 = {}

    newProd2["2906"] = {
      "value": [
          {
          "2902": {"value" : JSON.stringify({"value": product["Product Name"], "reference_column_id": product["record_id"]}), "record_id": recentRecordId},
          "2903": {"value" : "1", "record_id": recentRecordId},
          "2911": {"value" : JSON.stringify({"value": product["Price"], "reference_column_id": product["record_id"]}), "record_id": recentRecordId},
          "2913": {"value" : JSON.stringify({"reference_column_id": product["record_id"], "value": newImagedata}), "record_id": recentRecordId}
          }

      ],
      "record_id": mycartRecordId,
      "sub_list_id": "14198916"
  };
  console.log(newProd2);
  const resp3 = await ApiClient.sendRequest("/api/sheetApi/update-record", "POST", {}, {
      sheet_id: 34070233,
      data : newProd2
    });

    if (resp3.success) {
        setSnackbarData({
            isOpenSnackbar: true,
            snackbarMessage: "Product added to cart successfully",
            snackbarType: "success"
        });
    }
    setAddtobagLoadingId(null);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarData({
        isOpenSnackbar: false,
        snackbarMessage: "",
        snackbarType: "info"
    });
  }

  const action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const saveProduct = async (values, isEdit = false, criteria = "") => {
    console.log(isEdit);
    setAddProductLoading(true);
    let resp = {};
    if (isEdit) {
        resp = await ApiClient.sendRequest("/api/sheetApi/update-record", "POST", {}, {
            sheet_id: 45364008,
            data : values
          });
    } else if (isMultipleEdit) {
        if (selectedRecords.length > 1 && criteria == "") {
            selectedRecords.forEach((selRec, index) => {
                if(index > 0) {
                    criteria = criteria.concat(" or ")
                }
                criteria = criteria.concat("sheet_45364008.column_id=" + selRec)
            });
        }
        console.log(criteria);
        console.log(values);
        resp = await ApiClient.sendRequest("/api/sheetApi/update-multiple-records", "POST", {}, {
            sheet_id: 45364008,
            data : values,
            criteria: criteria
        });
    } else {
    resp = await ApiClient.sendRequest("/api/sheetApi/create-record", "POST", {}, {
        sheet_id: 45364008,
        data : values
      });
    }

    if (resp.success) {
        setSnackbarData({
            isOpenSnackbar: true,
            snackbarMessage: resp.message,
            snackbarType: "success"
        });
    } else {
        setSnackbarData({
            isOpenSnackbar: true,
            snackbarMessage: resp.message,
            snackbarType: "error"
        });
    }
    setAddProductLoading(false);
    handleCloseAddProduct();
    if(resp.success) {
        if (!isEdit && !isMultipleEdit) {
            let tempProducts = [...productsData, resp.record];
            setProductsData(tempProducts);
        } else {
            setupdateProducts(!updateProducts);
        }
    }
    setSelectedRecords([]);
  };

  const handleDeleteProduct = async (recordId) => {
    setDeleteProdLoadingId(recordId);
    const resp = await ApiClient.sendRequest("/api/sheetApi/delete-record", "POST", {}, {
        sheet_id: 45364008,
        delete_record_id : recordId
      });
      setDeleteProdLoadingId(null);
    if (resp.success) {
        setSnackbarData({
            isOpenSnackbar: true,
            snackbarMessage: resp.message,
            snackbarType: "success"
        });
    } else {
        setSnackbarData({
            isOpenSnackbar: true,
            snackbarMessage: resp.message,
            snackbarType: "error"
        });
    }
    
    if(resp.success) {
        let tempProducts = productsData.filter(prod => prod["record_id"] != recordId);
        setProductsData(tempProducts);
    }
  }

  const handleDeleteSelectedRecords = async () => {
    setDeleteSelectedRecordsLoading(true);
    const recordsData = selectedRecords.join(',');
    const resp = await ApiClient.sendRequest("/api/sheetApi/delete-multiple-records", "POST", {}, {
        sheet_id: 45364008,
        delete_record_ids : recordsData
      });
    setDeleteSelectedRecordsLoading(false);
    if (resp.success) {
        setSnackbarData({
            isOpenSnackbar: true,
            snackbarMessage: resp.message,
            snackbarType: "success"
        });
    } else {
        setSnackbarData({
            isOpenSnackbar: true,
            snackbarMessage: resp.message,
            snackbarType: "error"
        });
    }
    
    if(resp.success) {
        let tempProducts = productsData.filter(prod => selectedRecords.indexOf(prod["record_id"]) < 0);
        setProductsData(tempProducts);
    }
    setSelectedRecords([]);
  }

  return (
    <>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BusinessIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            >
            Riktam
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              ((page == "Orders" && loggedInUser && loggedInUser["Is Admin"] == "1") || page == "Products") &&
                <Button
                    key={page}
                    onClick={() => {
                    setPageName(page);
                    console.log(page);
                    }}
                    sx={{ my: 2, color: (pageName == page) ? 'white' : 'black', display: 'block' }}
                >
                    {page}
                </Button>
            ))}
            </Box>
            {(selectedRecords.length > 0 && loggedInUser && loggedInUser["Is Admin"] == "1") &&
            <Button
                style={{marginRight: 20}}
                onClick={(event) => {
                    handleDeleteSelectedRecords();
                    //setSelectedRecords([]);
                    // setIsOpenAddProduct(true);
                    console.log("hello");
                }}
                sx={{ my: 2, color: '#ad0c0c', display: 'block' }}
            >
                {selectedRecords.length  > 1 ?"Delete Products" : "Delete Product"}
                {
                deleteSelectedRecordsLoading &&
                <CircularProgress style={{width: 15, height:15, marginLeft: 5, color:"#ad0c0c"}} color="inherit" />
                }
            </Button>
            }
            {(selectedRecords.length > 0 && loggedInUser && loggedInUser["Is Admin"] == "1") &&
            <Button
                style={{marginRight: 20}}
                onClick={async () => {
                    if (selectedRecords.length  > 1) {
                        setIsMultipleEdit(true);
                        setIsOpenAddProduct(true);
                        console.log("hello");
                        setSnackbarData({
                            isOpenSnackbar: true,
                            snackbarMessage: "This is Multiple update. Update only required fields",
                            snackbarType: "info"
                        });
                    } else {
                    const resp = await ApiClient.sendRequest("/api/sheetApi/fetch-record", "POST", {}, {
                        sheet_id: 45364008,
                        record_id: selectedRecords[0]
                    });
                    setSingleProductData(resp.data);
                    setIsEditProduct(true);
                    setIsOpenAddProduct(true);
                    // handleDeleteSelectedRecords();
                    setSelectedRecords([]);
                    // setIsOpenAddProduct(true);
                    }
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                {selectedRecords.length  > 1 ?"Update Products" : "Update Product"}
            </Button>
            }
            {(selectedRecords.length > 0 && loggedInUser && loggedInUser["Is Admin"] == "1") &&
            <Button
                style={{marginRight: 20}}
                onClick={(event) => {
                    setSelectedRecords([]);
                    console.log("hello");
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                {"Unselect All"}
            </Button>
            }
            {(loggedInUser && loggedInUser["Is Admin"] == "1") &&
            <Button
                style={{marginRight: 30}}
                onClick={(event) => {
                    setIsOpenAddProduct(true);
                    console.log("hello");
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                {"Add Product"}
            </Button>
            }
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{loggedInUser ? loggedInUser["User name"][0].toUpperCase() : "R"}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                ((setting == 'Logout' && loggedInUser) || setting == 'Profile' || (setting == 'My cart' && loggedInUser && loggedInUser["Is Admin"] == "0")) &&
                <MenuItem 
                    key={setting} 
                    onClick={() => {hanldleSettingsClick(setting)}}
                >
                    {setting == 'Profile' && <AccountBoxIcon style = {{marginRight: 10}}></AccountBoxIcon>}
                    {setting == 'My cart' && <ShoppingBagIcon style = {{marginRight: 10}}></ShoppingBagIcon>}
                    {setting == 'Logout' && <LogoutIcon style = {{marginRight: 10}}></LogoutIcon>}
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    <Container maxWidth="xl">
    {pageName == 'Products' &&
        <Products 
            productsData={productsData}
            setProductsData={setProductsData}
            handleDeleteProduct={handleDeleteProduct}
            deleteProdLoadingId={deleteProdLoadingId}
            setIsOpenAddProduct={setIsOpenAddProduct}
            setSingleProductData={setSingleProductData}
            setIsEditProduct={setIsEditProduct}
            setSelectedRecords={setSelectedRecords}
            selectedRecords={selectedRecords}
            updateProducts={updateProducts}
            hanldleAddtoBag={hanldleAddtoBag}
            addtobagLoadingId={addtobagLoadingId}
        />
    }
    {pageName == 'Orders' &&
        <Orders />
    }
    {pageName == 'Customers' &&
        <Users />
    }
    </Container>
    <AddProduct 
        open={isOpenAddProduct} 
        handleCloseAddProduct={handleCloseAddProduct}
        saveProduct={saveProduct}
        addProductLoading={addProductLoading}
        singleProductData={singleProductData}
        isEditProduct={isEditProduct}
        isMultipleEdit={isMultipleEdit}
    />
    <MyCart 
        open={isOpenCart} 
        handleCloseCart={handleCloseCart}
        bagDetails={bagDetails}
        setBagDetails={setBagDetails}
        setCartColumnsData={setCartColumnsData}
        cartColumnsData={cartColumnsData}
        cartRecordId={cartRecordId}
        setCartRecordId={setCartRecordId}
        setSnackbarData={setSnackbarData}
        handlePlaceOrder={handlePlaceOrder}
    />
    <Snackbar 
        open={snackbarData.isOpenSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={action}
    >
        <Alert onClose={handleCloseSnackbar} severity={snackbarData.snackbarType} sx={{ width: '100%' }}>
            {snackbarData.snackbarMessage}
        </Alert>
    </Snackbar>
    </>
  );
}
export default ResponsiveAppBar;
