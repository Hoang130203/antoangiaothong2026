import { Avatar, Grid, Typography } from "@mui/material";

function Friend() {
    const listFriends = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return (
        <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', backgroundColor: '#fff', padding: '40px 0px' }}>
            <Grid container item xs={10} >
                {listFriends.map((item, index) => (
                    <Grid key={index} item container xs={12} sm={5.5} style={{ margin: '4px 5px ', height: '110px' }} border='1px solid #ebe6e6' borderRadius='10px'>
                        <Grid item container alignItems='center' xs={4} justifyContent='center'>
                            <Avatar style={{ height: '90px', width: '90px', maxWidth: '100%' }} src="https://minhtuanmobile.com/uploads/blog/honkai-star-rail-an-dinh-ngay-ra-mat-cua-jingliu-khien-game-thu-dung-ngoi-khong-yen-230815010127.jpg"></Avatar>
                        </Grid>
                        <Grid item container xs={8} alignItems='center'>
                            <Typography variant="h5">{'Jingliu'}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Friend;