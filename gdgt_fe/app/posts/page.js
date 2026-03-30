'use client'
import { Avatar, Divider, Grid, Popover, Typography } from "@mui/material";
import styles from './post.module.css'
import { useEffect, useState } from "react";
import FormPost from "./FormCreatePost";
import Post from "./post";
import Api from '../api/api';
function Posts() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [listPost, setListPost] = useState([
    ])
    const [loaded, setLoaded] = useState(false)
    try {
        var avatar = localStorage.getItem('avatar')
    } catch (error) {
        console.log(error)
    }
    const handleClick = (event) => {
        console.log('abc')
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        // Fetch data when component mounts
        Api.getPost()
            .then(response => {
                // Set listPost state with data from API response
                setListPost(response?.data.reverse());
                setLoaded(true)
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, [])
    return (
        <Grid container style={{ minHeight: '800px', display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
            <div style={{ display: `${loaded ? 'none' : 'fixed'}` }} className="loader_container">
                <div className="loader_" ></div>
            </div>
            <Grid container item style={{ width: '800px', height: '130px', maxWidth: '92%', backgroundColor: '#fff', marginBottom: '20px' }} className={styles.border_div}>
                <Grid item container display='flex' justifyContent='center' padding='10px 0px' >
                    <Grid item xs={2} md={1}>
                        <Avatar style={{ width: '45px', height: '45px', marginRight: '20px' }} src={avatar}></Avatar>
                    </Grid>
                    <Grid item xs={9} md={10} >
                        <button className={styles.button_newpost} onClick={handleClick}>
                            <Typography>Đăng bài viết mới!</Typography>
                        </button>
                        {open && <div className={styles.form_overlay} onClick={handleClose}></div>}

                        <Popover
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: 300, left: 800 }}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            style={{ width: '0px', height: '0px' }}
                        >
                            <FormPost handleClick={handleClose} />
                        </Popover>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item container alignItems='center'>
                    <Grid item xs={4} container justifyContent='center' height='80%'>
                        <img width='24px'
                            src="https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/v1iF2605Cb5.png?_nc_eui2=AeEW76pCPuQhAZiqT9L93eEQ3Eh3Wgl8GJPcSHdaCXwYk44HWuEJDgJ8PxIE11OlidU2aMel8Tb25Azn2wWGRLTi"></img>
                    </Grid>
                    <Grid item xs={4} container justifyContent='center' height='80%'>
                        <img width='24px'
                            src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png?_nc_eui2=AeHYQhKsSC3wpWPDa-ABRgB1fK5Z1qDG7FV8rlnWoMbsVZ1ukwvLstFJoiCIQnb9eDwyl7MoTpI2y6BWL18lNkRE"></img>
                    </Grid>
                    <Grid item xs={4} container justifyContent='center' height='80%'>
                        <img width='24px'
                            src="https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/eQV2iXPmmtj.png?_nc_eui2=AeHOJt0qh-SKJN-pXtrja-VbCQLHsh12NTkJAseyHXY1OZuoWmeWwFqvO-Te94eJXt0Exy_3bSRmEql6IctFViKF"></img>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent='center'>
                {listPost.map((item, index) => (
                    <Post key={index} id={item.id} title={item.title} image={item.image} time={item.time} username={item.user.name} useravatar={item.user.avatar} />
                ))}
            </Grid>
        </Grid>
    );
}

export default Posts;