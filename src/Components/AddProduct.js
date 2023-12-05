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

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Backdrop from '@mui/material/Backdrop';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }


function AddProduct(props) {
  const [values, setValues] = React.useState({});
  const [subsheetValues, setSubsheetValues] = React.useState({});
  const [tabValue, setTabValue] = React.useState(0);
  const [columnsData, setColumnsData] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const uploadInputRef = React.useRef(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isUploadingFile, setIsUploadingFile]  = React.useState(false);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCapture = ({ target }) => {
    setSelectedFile(target.files[0]);
    console.log(target.files[0]);
  };

  const handleCloseSubsheetPopover = () => {
    setAnchorEl(null);
    setSubsheetValues({});
  }

  const updateValues = (colId, value) => {
    let tempValues={};
    if (values[colId]) {
        tempValues[colId] = values[colId];
        tempValues[colId]["value"] = value;
    } else {
        tempValues[colId] = {"value": value};
    }
    
    tempValues = {...values, ...tempValues};
    setValues(tempValues);
  }

  const renderColumns = (columns = []) => {
    return <Grid
              container
              direction="row"
              style ={{padding: 40, justifyContent: "center"}}
              spacing={1}
            >
            {columns.map((col, index) => 
                col.default_type != "1" && col.name != "Ordered Quantity" && col.name != "Available Quantity" ?
                    col.column_type_id == "1" || col.column_type_id == "10" ?
                        <Grid key={index} item xs={7}>
                            <TextField
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            label={col.name}
                            id={col.name}
                            onChange = {(e) => {
                                updateValues(col.column_id, e.target.value);
                                // const colId = col.column_id;
                                // let tempValues={};
                                // tempValues[colId] = {"value": e.target.value}
                                // tempValues = {...values, ...tempValues};
                                // setValues(tempValues)
                            }}
                            value = {values[col.column_id] ? values[col.column_id]["value"] : ""}
                            />
                        </Grid>
                    : col.column_type_id == "3" ?
                            renderDropdown(col, index)
                        : col.column_type_id == "5" || col.column_type_id == "17" ?
                            <Grid key={index} item xs={7}>
                                <TextField
                                type="number"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                label={col.name}
                                id={col.name}
                                value = {values[col.column_id] ? values[col.column_id]["value"] : ""}
                                onChange = {(e) => {
                                    updateValues(col.column_id, e.target.value);
                                    // const colId = col.column_id;
                                    // let tempValues={};
                                    // tempValues[colId] = {"value": e.target.value}
                                    // tempValues = {...values, ...tempValues};
                                    // setValues(tempValues)
                                }}
                                />
                            </Grid>
                            : col.column_type_id == "9" ?
                                <Grid key={index} item xs={7}>
                                    <>
                                        <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange = {handleCapture}
                                        />
                                        <Button
                                        onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                                        variant="contained"
                                        >
                                        Select Image
                                        </Button>
                                        <span style={{marginLeft: 10}}>{selectedFile ? selectedFile.name : (values[col.column_id] ? (values[col.column_id]["value"] == "" ? "" : (typeof JSON.parse(values[col.column_id]["value"]) == "object" ? JSON.parse(values[col.column_id]["value"])[0]["name"] : "")) : "")}</span>
                                    </>
                                </Grid>
                            :
                            <></>
                :
                <div></div>
            )}
            </Grid>
  }

  const renderSubsheetColumns = (columns = [], columnId, sheetId) => {
    // console.log(subsheetValues);
    return <Grid
              container
              direction="row"
              style ={{padding: 40}}
              spacing={1}
            >
            <Button 
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                }}
                style = {{marginBottom: 10}}
            >
            Add
            </Button>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 600 }}  aria-label="simple table">
                    <TableHead>
                    <TableRow>
                    {columns.map((col, index) => 
                        col.default_type != 1 &&
                            <TableCell key={index}><b>{col.name}</b></TableCell>
                    )}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {values[columnId] && values[columnId]["value"] && values[columnId]["value"].map((row, indexx) => (
                        <TableRow
                        key={indexx}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {columns.map((col, index) => 
                                col.default_type != 1 &&
                                    <TableCell key={index}>{row[col.column_id] ? row[col.column_id]["value"] : ""}</TableCell>
                            )}
                        
                        <TableCell>{row.calories}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Popover
                id={Boolean(anchorEl) ? 'simple-popover' : undefined}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => {
                    handleCloseSubsheetPopover();
                }}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
            <Grid
              container
              direction="row"
              style ={{paddingTop: 40, paddingLeft: 40, paddingRight: 40, paddingBottom: 20, maxWidth: 600}}
              spacing={1}
            >  
                <Grid item xs={11}>
                    <Typography variant="h6">
                        New Entry
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
                        handleCloseSubsheetPopover();
                    }}
                >
                    <CloseIcon />
                </IconButton>
                </Grid>         
            {columns.map((col, index) => 
                col.default_type != "1" && col.name != "Ordered Quantity" && col.name != "Available Quantity" ?
                    col.column_type_id == "1" ?
                        <Grid key={index} item xs={12}>
                            <TextField
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            label={col.name}
                            id={col.name}
                            onChange = {(e) => {
                                const colId = col.column_id;
                                let tempValues={};
                                tempValues[colId] = {"value": e.target.value}
                                tempValues = {...subsheetValues, ...tempValues};
                                setSubsheetValues(tempValues);
                            }}
                            value = {subsheetValues[col.column_id] ? subsheetValues[col.column_id]["value"] : ""}
                            />
                        </Grid>
                    : col.column_type_id == "5" || col.column_type_id == "17" ?
                    <Grid key={index} item xs={12}>
                        <TextField
                        fullWidth
                        type="number"
                        margin="dense"
                        variant="outlined"
                        label={col.name}
                        id={col.name}
                        onChange = {(e) => {
                            const colId = col.column_id;
                            let tempValues={};
                            tempValues[colId] = {"value": e.target.value}
                            tempValues = {...subsheetValues, ...tempValues};
                            setSubsheetValues(tempValues);
                        }}
                        value = {subsheetValues[col.column_id] ? subsheetValues[col.column_id]["value"] : ""}
                        />
                    </Grid>
                    :
                     <></>
                :
                <div></div>
            )}
                <Grid item xs={8}>
                </Grid>

                <Grid item float="right">
                <Button 
                    onClick={() => {
                        handleCloseSubsheetPopover();
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={() => {
                        if (values[columnId]) {
                            let tempValues = values[columnId]["value"];
                            tempValues = [...tempValues, subsheetValues];
                            let finalSubsheetValues = {};
                            finalSubsheetValues[columnId] = {"value": tempValues, "sub_list_id": sheetId};
                            finalSubsheetValues = {...values, ...finalSubsheetValues};
                            setValues(finalSubsheetValues);
                        } else {
                            let tempValues = {};
                            tempValues[columnId] = {"value": [subsheetValues], "sub_list_id": sheetId};
                            tempValues = {...values, ...tempValues};
                            setValues(tempValues);
                        }                        
                        handleCloseSubsheetPopover();
                    }}
                >
                    Add
                </Button>
                </Grid> 
            </Grid>
            </Popover>
            </Grid>
  }

  const renderDropdown = (col, index) => {
    let options = col.options;
    if(typeof options == "string") {
        options = JSON.parse(options)[0]["options"];
    }
    return <Grid key={index} item xs={7}>
            <TextField
            style={{ marginTop: 20 }}
            label={col.name}
            fullWidth
            select
            variant="outlined"
            value = {values[col.column_id] ? values[col.column_id]["value"] : ""}
            id={col.name}
            margin="dense"
            >
            {options.map((option, ind) => 
                <MenuItem 
                    key={ind} 
                    value={option} 
                    onClick = {(e) => {
                        updateValues(col.column_id, option);
                    }}
                    >
                {option}
                </MenuItem>
            )}
            </TextField>
        </Grid>
  }

  const fetchAllColumns = async () => {
    // const resp1 = await ApiClient.sendRequest("/login/validate-login?email=apheespandiri123@gmail.com&password=aphees", "GET", {}, {});
        const resp = await ApiClient.sendRequest("/api/sheetApi/get-sheet-columns", "POST", {}, {
            sheet_id: 45364008
          });
        if (resp.success) {
            setColumnsData(resp.data);
            if(props.isEditProduct && props.singleProductData) {
                formatValuesData();
            }
        }
    };

    const formatValuesData = () => {
        // console.log("formatValuesData");
        // console.log(props.isEditProduct);
        // console.log(props.singleProductData);
        // console.log(columnsData);
        let editValues = {};
        columnsData.forEach((col) => {
            if(col.default_type != "1" && col.name != "Ordered Quantity" && col.name != "Available Quantity") {
                if(col.column_type_id == 6) {
                    if (props.singleProductData[col.name] && props.singleProductData[col.name].length > 0) {
                        let subsheetVals = [];
                        let subsheetRecords = props.singleProductData[col.name];
                        let subSheetCols = col.list_columns;
                        subsheetRecords.forEach((subRec, subRecIndex) => {
                            let subsheetFormattedRec = {};
                            subSheetCols.forEach((subsheetCol, subIndex) => {
                                if(subsheetCol.default_type != "1") {
                                    subsheetFormattedRec[subsheetCol.column_id] = {"value" : subRec[subsheetCol.name], "record_id" : subRec.record_id};
                                }
                            });
                            subsheetVals.push(subsheetFormattedRec);
                        });
                        editValues[col.column_id] = { "value" : subsheetVals, "sub_list_id": col.list_columns[0]["sheet_id"]}
                    }
                } else {
                    editValues[col.column_id] = {"value" : props.singleProductData[col.name], "record_id" : props.singleProductData.record_id}
                }
            }
        });
        console.log(editValues);
        setValues(editValues);
    }

    React.useEffect(() => {
        fetchAllColumns();
        return () => {
            setValues({});
            setTabValue(0);
            setSelectedFile(null);
          }
    }, [props.open]);
    // console.log(values);
  
    let TabNames = ["General"];
    let TabColumns = [columnsData];
    let TabColumnIds = [0];
    let TabSheetIds = [45364008];
    columnsData.forEach(column => {
        if(column.column_type_id == "6") {
            TabNames.push(column.name);
            TabColumns.push(column.list_columns);
            TabColumnIds.push(column.column_id);
            TabSheetIds.push(column.list_columns[0] ? column.list_columns[0]["sheet_id"] : 0);
        }
    });

    
  
    return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={props.open}
      onClose={() => {
        props.handleCloseAddProduct();
    }}
    >
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isUploadingFile}
        >
            <CircularProgress color="inherit" /> Uploading file...
        </Backdrop>
    <DialogTitle>
    <Grid container direction="row" style={{backgroundColor: "#cccccc", padding: 20, alignItems: "center"}}>
        <Grid item xs={11}>
        <Typography variant="h5">
            {props.isEditProduct ? "Edit product" : "Add product"}
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
            props.handleCloseAddProduct();
            }}
        >
            <CloseIcon />
        </IconButton>
        </Grid>

    </Grid>
    </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item>
            {props.isMultipleEdit &&
          <Typography style={{color: "red", padding: 10}} variant="body2">
            {"This is Multiple update. Update only required fields"}
            </Typography>
            }
          <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 500 }}
            >
            
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider', maxWidth: 100 }}
            >
                {TabNames.map((TabName, id)=>
                    <Tab label={TabName} {...a11yProps(id)} />
                )}
                
            </Tabs>
            {TabNames.map((TabName, id)=>
                id == 0 ?
                <TabPanel value={tabValue} index={id}>
                    {renderColumns(TabColumns[id])}
                </TabPanel>
                :
                <TabPanel value={tabValue} index={id}>
                    {renderSubsheetColumns(TabColumns[id], TabColumnIds[id], TabSheetIds[id])}
                </TabPanel>
            )}            

            </Box>
            
            {/* <Grid
              container
              direction="row"
              style ={{padding: 40, justifyContent: "center"}}
              spacing={1}
            >
            {columnsData.map((col, index) => 
                col.default_type != "1" && col.name != "Ordered Quantity" && col.name != "Available Quantity" ?
                    col.column_type_id == "1" ?
                        <Grid key={index} item xs={7}>
                            <TextField
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            label={col.name}
                            id={col.name}
                            onChange = {(e) => {
                                const colId = col.column_id;
                                let tempValues={};
                                tempValues[colId] = {"value": e.target.value}
                                tempValues = {...values, ...tempValues};
                                setValues(tempValues)
                            }}
                            value = {values[col.column_id] ? values[col.column_id]["value"] : ""}
                            />
                        </Grid>
                    : col.column_type_id == "3" ?
                            renderDropdown(col, index)
                        : col.column_type_id == "5" || col.column_type_id == "17" ?
                            <Grid key={index} item xs={7}>
                                <TextField
                                type="number"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                label={col.name}
                                id={col.name}
                                value = {values[col.column_id] ? values[col.column_id]["value"] : ""}
                                onChange = {(e) => {
                                    const colId = col.column_id;
                                    let tempValues={};
                                    tempValues[colId] = {"value": e.target.value}
                                    tempValues = {...values, ...tempValues};
                                    setValues(tempValues)
                                }}
                                />
                            </Grid>
                            : <></>
                :
                <div></div>
            )}
            </Grid> */}
            
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
          <Button onClick={() => {props.handleCloseAddProduct();}}>Cancel</Button>
          <Button 
            onClick={async () => {
                if(selectedFile) {
                    setIsUploadingFile(true);
                    const formData = new FormData();
                    formData.append("Filedata[]", selectedFile, selectedFile.name);
                    let resp = await ApiClient.sendRequest("/api/sheetApi/file-upload", "POST", {}, formData, false);
                    console.log(resp);
                    resp["files"].forEach((uploadedFile, key) => {
                        uploadedFile.filepath = uploadedFile.uploaded_name;
                        uploadedFile.fullpath = uploadedFile.path;
                    });
                    updateValues(2912, JSON.stringify(resp["files"]));
                    setIsUploadingFile(false);
                }
                await props.saveProduct(values, props.isEditProduct);
            }}
            >
            SAVE {
                    props.addProductLoading &&
                    <CircularProgress style={{width: 20, height:20}} color="inherit" />
                }
            </Button>
        </DialogActions>
    </Dialog>
  );
}

export default AddProduct;
