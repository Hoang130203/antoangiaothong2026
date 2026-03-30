'use client'
import { Avatar, Button, Grid, Input, InputLabel, TextField, TextareaAutosize, Typography } from '@mui/material';
import styles from './post.module.css'
import CancelIcon from '@mui/icons-material/Cancel';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiPicker from "emoji-picker-react";
import Api from '../api/api';
function FormPost({ handleClick }) {
    const [inputStr, setInputStr] = useState("");
    const [title, setTitle] = useState("");
    const [isDisabled, setIsDisabled] = useState(false)
    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (emojiData, event) => {
        setInputStr((prevInput) => prevInput + emojiData.emoji);
        setShowPicker(false);
        //    console.log(inputStr)
    };
    try {
        var user = localStorage.getItem('user')
        var avatar = localStorage.getItem('avatar')
    } catch (error) {
        console.log(error)
    }

    const [visibleImage, setVisibleImage] = useState(false)
    const [visibleVideo, setVisibleVideo] = useState(false)
    const handleShowImage = () => {
        setVisibleVideo(false)
        setVisibleImage(true)
    }
    const hideImage = () => {
        setAvt('')
        setVisibleImage(false)

    }
    const hideVideo = () => {
        setVisibleVideo(false)
    }
    const handleShowVideo = () => {
        setVisibleImage(false)
        setVisibleVideo(true)
    }
    const [avt, setAvt] = useState('')
    const [file, setFile] = useState()
    const handleFileChange = (event) => {
        // setIsposting(false)
        const selectedFile = event.target.files[0]
        setFile(event.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            setAvt(reader.result); // Lưu URL vào state để hiển thị ảnh
        };
        reader.readAsDataURL(selectedFile);
    }
    const handlePost = async () => {
        await setIsDisabled(true)
        if (avt.length > 0) {
            await Api.PostImage(file).then((response) => {
                Api.upPost(title, inputStr, response.data.url).then(() => {
                    alert('Đăng bài thành công')
                })
            })
        } else {
            await Api.upPost(title, inputStr, '').then(() => {
                alert('Đăng bài thành công')
            })

        }
    }
    return (
        <div className={styles.form_post}>
            <Grid container className={styles.form_post_head}>
                <div></div>
                <Typography variant='h6' fontWeight={600} style={{ position: 'relative', left: '10px' }}>Tạo bài viết</Typography>
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
                            {user ?? ''}
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
                    <TextField placeholder='Tiêu đề bài viết' variant='filled' style={{ outline: 'none', width: '95%', border: 'none', }} inputProps={{
                        style: { fontSize: 22, padding: 5, fontWeight: 600 },
                    }} value={title} onChange={(e) => { setTitle(e.target.value) }} ></TextField>
                </div>
                <div>
                    <TextareaAutosize value={inputStr} onChange={(e) => setInputStr(e.target.value)} placeholder='Nhập nội dung bài viết ở đây!' style={{ marginLeft: '10px', padding: '10px', width: '95%', minHeight: '100px', fontSize: '20px', border: 'none', outline: 'none' }}></TextareaAutosize>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                    <div onClick={() => { setShowPicker(true) }}>
                        <SentimentSatisfiedAltIcon fontSize='large' style={{ position: 'relative', right: '10px', cursor: 'pointer' }} />
                    </div>
                    <div style={{ position: 'fixed', top: '10px', zIndex: '99' }}>
                        {showPicker && (
                            <EmojiPicker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
                        )}
                    </div>
                </div>
                {visibleImage &&
                    <Grid container height='250px' justifyContent='center' marginBottom='10px'>
                        <Grid container item border='1px solid #ccc' width='95%' borderRadius='10px' >
                            <Grid container item justifyContent='flex-end' style={{ backgroundImage: `url(${avt})`, backgroundSize: 'cover' }}>
                                <div style={{ cursor: 'pointer', padding: '5px' }} onClick={hideImage}>
                                    <CancelIcon sx={{ color: 'blueviolet' }} />

                                </div>
                                <Grid container item xs={12} justifyContent='center'>
                                    <div style={{ cursor: 'pointer', backgroundColor: '#ccc', width: '42px', height: '42px', borderRadius: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <InputLabel htmlFor="file-input" style={{ cursor: 'pointer' }}>
                                            <AddPhotoAlternateIcon fontSize='large' />
                                        </InputLabel>
                                        <Input id="file-input" type="file" style={{ display: 'none' }} onChange={handleFileChange} />

                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                {visibleVideo &&
                    <Grid container height='200px' justifyContent='center' marginBottom='10px'>
                        <Grid container item border='1px solid #ccc' width='95%' borderRadius='10px' justifyContent='flex-start'>
                            <Grid container item justifyContent='flex-end' height='30px'>
                                <div style={{ cursor: 'pointer', padding: '5px' }} onClick={hideVideo}>
                                    <CancelIcon sx={{ color: 'blueviolet' }} />
                                </div>

                            </Grid>

                        </Grid>
                    </Grid>
                }
            </div>
            <Grid container justifyContent='center'>
                <Grid container item alignItems='center' sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '12px 0px', width: '95%' }}>
                    <Grid item xs={7} container justifyContent='center'>
                        <Typography variant='h7' fontWeight={600}>Thêm vào bài viết của bạn</Typography>
                    </Grid>
                    <img onClick={handleShowImage} width='25px' style={{ marginLeft: '5px', cursor: 'pointer' }} src='https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png?_nc_eui2=AeHYQhKsSC3wpWPDa-ABRgB1fK5Z1qDG7FV8rlnWoMbsVZ1ukwvLstFJoiCIQnb9eDwyl7MoTpI2y6BWL18lNkRE'></img>
                    <img onClick={handleShowVideo} width='25px' style={{ marginLeft: '10px', cursor: 'pointer' }} src='https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/eQV2iXPmmtj.png?_nc_eui2=AeHOJt0qh-SKJN-pXtrja-VbCQLHsh12NTkJAseyHXY1OZuoWmeWwFqvO-Te94eJXt0Exy_3bSRmEql6IctFViKF'></img>
                </Grid>
            </Grid>
            <Grid container item justifyContent='center'>
                <Button disabled={isDisabled} onClick={handlePost} sx={{ textTransform: 'none', width: '95%', margin: '20px 0px', fontSize: '17px' }} variant='contained'>
                    Đăng bài
                </Button>
            </Grid>
        </div>
    );
}

export default FormPost;