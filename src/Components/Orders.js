import * as React from 'react';
import ApiClient from './Api/ApiClient';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Orders() {
    const [ordersData, setOrdersData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const addTextOptionsToConfig = async () => {
        // const resp1 = await ApiClient.sendRequest("/login/validate-login?email=apheespandiri123@gmail.com&password=aphees", "GET", {}, {});
        const resp = await ApiClient.sendRequest("/api/sheetApi/get-records", "POST", {}, {
            sheet_id: 93102299
          });
        
        if (resp.success) {
            setOrdersData(resp.data);
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        addTextOptionsToConfig();
      }, []);

    if(ordersData.length == 0 && isLoading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }
    
    return (
    <>
        <div className="App">
            <h1>Orders <span style = {{color:"blue"}}>{ordersData.length}</span></h1> 
        </div>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            
            {
               ordersData.map((order, index) =>
               <Grid key={index} item xs={3}>
               <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5">
                            {order["User Name"]}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" component="div">
                            {order["User Email"]}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {order["User Address"]}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {order["User Phone no"]}
                        </Typography>
                        {
                        <Typography variant="body2">
                            {"Total Price "}{order["Total Price"]}
                        </Typography>
                        
                        }
                    </CardContent>
                    <CardActions>
                        <Button size="small">View Items</Button>
                    </CardActions>
                </Card>
               </Grid>
               ) 
            }
      </Grid>
      </>
    );
  }
  
export default Orders;