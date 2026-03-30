import { Avatar, Grid, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { use } from "react";

function Post({ id, title, image, time, username, useravatar }) {
    const xs = useMediaQuery('(max-width:600px)')
    if (image == null || image.length == 0) image = "https://i1-vnexpress.vnecdn.net/2024/02/06/VNE-Bridge-6840-1707217751.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=CReOm7XfMKVaTMfMHrzOKQ"
    if (useravatar == null || useravatar.length == 0) useravatar = "https://genk.mediacdn.vn/2020/1/2/photo-1-1577935737189597218219.jpg"
    return (
        <Grid container item style={{
            width: '800px', height: '430px', maxWidth: '92%', backgroundColor: '#fff', margin: '10px 0px', borderRadius: '10px', boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.145)',
            background: `url("${image}")`,
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
        }}>

            <Grid container item xs={12} height={'60%'}></Grid>

            <Grid container item xs={12} height='40%' style={{ opacity: '0.8', cursor: 'pointer' }}>
                <div style={{ width: '100%', height: '24px', zIndex: '1', background: 'linear-gradient(rgba(212, 212, 212, 0) 0%, rgb(212, 212, 212) 100%)' }}></div>
                <Grid container sx={{ height: 'calc(100% - 24px)', bgcolor: '#d4d4d4', padding: '3px 20px' }} >
                    <Grid item xs={12}>Tuyển sinh</Grid>
                    <Grid item xs={12} style={{ maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600' }}>
                        <Link href={`/posts/detail/${id}`}>
                            {title}
                        </Link>
                    </Grid>
                    <Grid container xs={12} >
                        <Grid item container xs={8} alignItems='center'>
                            <Avatar style={{ width: '40px', height: '40px' }} src={useravatar}></Avatar>
                            <Typography variant="h6" fontWeight={600} style={{ color: '#3e8ed0bf', paddingLeft: '10px' }}>{username}</Typography>
                        </Grid>
                        <Grid item xs={4} container alignItems='center' justifyContent='flex-end'>
                            <Typography style={{ paddingLeft: '10px' }}>{time.substring(0, 10)}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Post;