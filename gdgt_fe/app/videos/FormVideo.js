'use client'
import { Avatar, Button, Grid, TextField, Typography } from '@mui/material';
import styles from '../posts/post.module.css'
import CancelIcon from '@mui/icons-material/Cancel';

import { useState } from 'react';
import Api from '../api/api'
function FormVideo({ handleClick }) {
    const [idVideo, setidVideo] = useState('')
    const [title, setTitle] = useState('')
    const [loaded, setLoaded] = useState(true)
    const [isDisabled, setIsDisabled] = useState(false)
    const postVideo = async () => {
        await setLoaded(false)
        await setIsDisabled(true)
        await Api.postVideo(title, idVideo.replace('https://www.youtube.com/watch?v=', ''))
            .then(res => {
                if (res.status === 200) {
                    alert('Đăng video thành công')
                } else {
                    alert('Đăng video thất bại')
                }
            })
            .catch(err => {
                alert('Đăng video thất bại')
            }).finally(() => {
                // setLoaded(true)
            })

    }
    try {
        var avatar = localStorage.getItem('avatar')
        var name = localStorage.getItem('user')
    } catch (error) {
        console.log(error)
    }
    return (
        <div className={styles.form_post}>
            <div style={{ display: `${loaded ? 'none' : 'fixed'}` }} className="loader_container">
                <div className="loader_" ></div>
            </div>
            <Grid container className={styles.form_post_head}>
                <div></div>
                <Typography variant='h6' fontWeight={600} style={{ position: 'relative', left: '10px' }}>Đăng video</Typography>
                <div onClick={handleClick}>
                    <CancelIcon color='disabled' fontSize='large' style={{ right: '10px', position: 'relative', cursor: 'pointer' }} />
                </div>
            </Grid>
            <div className={styles.form_post_info}>
                <Grid container padding='10px 0px'>
                    <Grid item xs={2} container justifyContent='center'>
                        <Avatar style={{ width: '42px', height: '42px' }} src={avatar}>
                        </Avatar>
                    </Grid>
                    <Grid container item xs={10}>
                        <Grid item xs={12} style={{ fontWeight: '600', height: '20px' }}>
                            {name}
                        </Grid>
                        <Grid item style={{ height: '20px' }} >
                            <button style={{ textAlign: 'center', padding: '1px 10px', fontWeight: '500', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
                                <img width='12px' height='12px' style={{ marginRight: '5px' }} src='https://static.xx.fbcdn.net/rsrc.php/v3/ys/r/L39Daxsxmmw.png?_nc_eui2=AeGGKcsm_Kyo2hcB88B75wwD7IOJAI68cdTsg4kAjrxx1L-K3X_q80rWA8gxNbPuSGKDasmiNHgw6vMF99OC6ONe'></img>
                                Công khai
                            </button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField value={title} onChange={(e) => { setTitle(e.target.value) }} placeholder='Tiêu đề video' variant='filled' style={{ outline: 'none', width: '95%', border: 'none', }} inputProps={{
                        style: { fontSize: 22, padding: 5, fontWeight: 600 },
                    }} ></TextField>
                </div>


                <Grid container height='150px' justifyContent='center' marginBottom='10px'>
                    <Grid container item border='1px solid #ccc' width='95%' borderRadius='10px' justifyContent='flex-start'>
                        <Grid container item justifyContent='flex-end' height='30px'>

                        </Grid>
                        <Grid container item xs={12} justifyContent='center'>
                            <Typography variant='h6'>Gắn đường dẫn video Youtube tại đây</Typography>
                            <TextField value={idVideo} onChange={(e) => { setidVideo(e.target.value) }} sx={{ width: '90%' }}></TextField>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            <Grid container item justifyContent='center'>
                <Button disabled={isDisabled} onClick={postVideo} sx={{ textTransform: 'none', width: '95%', margin: '20px 0px', fontSize: '17px' }} variant='contained'>
                    Đăng video
                </Button>
            </Grid>
        </div>
    );
}

export default FormVideo;