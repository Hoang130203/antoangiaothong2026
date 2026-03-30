'use client'
import { Avatar, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import styles from './detail.module.css'
import { use, useEffect, useState } from "react";
import Link from "next/link";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiPicker from "emoji-picker-react";
import SendIcon from '@mui/icons-material/Send';
import Api from '../../../api/api';

function Detail({ params }) {
    const [inputStr, setInputStr] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [post, setPost] = useState()
    const [lines, setLines] = useState([])
    const [loaded, setLoaded] = useState(false)
    const iconColor = inputStr.trim() !== '' ? 'blue' : 'disabled';
    const [react, setReact] = useState('0')
    const [listComment, setListComment] = useState([])
    const [active, setActive] = useState('0')

    const onEmojiClick = (emojiData, event) => {
        setInputStr((prevInput) => prevInput + emojiData.emoji);
        setShowPicker(false);
        // console.log(inputStr)
    };
    // const router = useRouter()
    useEffect(() => {
        console.log(params.id)
        // Fetch data when component mounts
        Api.getPostById(params.id)
            .then(response => {
                // Set listPost state with data from API response
                setPost(response.data);
                setLines(response.data.content.split('\n'))
                setLoaded(true)
                setListComment(response.data.listComment)
                setReact(response.data.react)
                setActive(response.data.react)
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, [])
    // [
    //     { avatar: 'https://minhtuanmobile.com/uploads/blog/huong-dan-build-ayaka-genshin-impact-sieu-dps-reroll-o-ban-4-3-240105115624.jpg', name: 'kamisato ayaka', comment: 'Cho em hỏi phúc khảo viện lí thì điểm pk thông báo ở đâu ạ.' },
    //     { avatar: 'https://cdn.oneesports.vn/cdn-data/sites/4/2022/02/hinh-nen-Luffy-2K-chat-ngau.jpg', name: 'Monkey.D.Luffy', comment: 'Messi giãi bày về sự cố tại Hong Kong..👇👇👇' },
    //     { avatar: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/liliana.jpg', name: 'Liliana', comment: ' Liliana liệu có khả năng bị neft sau highlight “ăn” Tà Thần trong phút chốc?' },

    // ]

    const [saved, setSaved] = useState(false)
    const clickReact = (value) => {
        if (value == active) {
            setActive(0)
        } else {
            setActive(value)

        }
        if (value == react) {
            setReact('0')
            Api.postReact(params.id, '0').then(
                res => {
                    console.log(res)
                }
            )
        } else {
            setReact(value)
            Api.postReact(params.id, value).then(
                res => {
                    console.log(res)
                }
            )
        }

    }
    const clickSaved = () => {
        if (saved == true) {
            setSaved(false)
        } else {
            setSaved(true)
        }

    }
    try {
        var avatar = localStorage.getItem('avatar')
        var name = localStorage.getItem('user')
    }
    catch (error) {
        console.log(error)
    }
    const handleComment = async () => {
        if (inputStr.trim() !== '') {
            await setLoaded(false)
            console.log(loaded)
            await Api.postComment(params.id, inputStr).then(
                res => {
                    // if (res.status == 200) {
                    alert('Đã gửi bình luận')
                    setListComment([...listComment, { user: { avatar: avatar, name: name }, content: inputStr }])
                    // }
                }
            )
            await setLoaded(true)
        }
    }

    return (
        <div style={{ minHeight: '800px', marginBottom: '300px' }}>
            <Grid container justifyContent='center' padding='20px 0px'>
                <div style={{ display: `${loaded == true ? 'none' : 'fixed'}` }} className="loader_container">
                    <div className="loader_" ></div>
                </div>
                <Grid item container width='900px' maxWidth='90%' minHeight='100px'>
                    <Grid item xs={12}>
                        <Typography fontSize='36px' fontFamily='revert-layer'>
                            {post?.title}
                        </Typography>
                    </Grid>
                    <Grid item container xs={12} alignItems='center'>
                        <Avatar style={{ width: '32px', height: '32px', marginRight: '12px' }} src={post?.owner.avatar}>
                        </Avatar>
                        <Typography fontSize='18px'>{post?.owner.name}  .&nbsp;</Typography>
                        <Typography fontSize='14px' style={{ color: '#a6a19b' }}> {post?.time}</Typography>
                    </Grid>
                    <div style={{ whiteSpace: 'pre-wrap', width: '100%', wordWrap: 'break-word' }} >

                        {lines.map((line, index) => (
                            // Hiển thị mỗi dòng trên một dòng mới

                            <h4 style={{ fontSize: '18px' }} key={index}>{line}</h4>

                        ))}

                    </div>
                    <img src={post?.image}
                        style={{ maxWidth: '100%', margin: "20px 0px" }} alt="."
                    ></img>
                    <Grid item xs={12} padding='10px 0px'><Divider /></Grid>
                    <Grid item container>
                        <Grid item container xs={8}>

                            <div onClick={() => { clickReact('1') }}
                                className={`${styles.outline_reaction} ${active == '1' ? styles.outline_reaction_active : ''}`}>
                                <ThumbUpIcon style={{ color: 'blue' }} />
                            </div>
                            <div onClick={() => { clickReact('2') }}
                                className={`${styles.outline_reaction} ${active == '2' ? styles.outline_reaction_active : ''}`}>
                                <FavoriteIcon style={{ color: "red" }} />
                            </div>
                            <div onClick={() => { clickReact('3') }}
                                className={`${styles.outline_reaction} ${active == '3' ? styles.outline_reaction_active : ''}`}>
                                <EmojiEmotionsIcon style={{ color: "orange" }} />
                            </div>
                            <div onClick={() => { clickReact('4') }}
                                className={`${styles.outline_reaction} ${active == '4' ? styles.outline_reaction_active : ''}`}>
                                <ThumbDownAltIcon style={{ color: "ActiveBorder" }} />
                            </div>
                        </Grid>
                        <Grid item container xs={4} justifyContent='flex-end'>
                            <Tooltip title={saved ? 'Bỏ lưu' : 'Lưu'}>
                                <div onClick={() => { clickSaved() }}
                                    className={`${styles.outline_reaction} ${saved ? styles.outline_reaction_active : ''}`}>
                                    <BookmarkIcon />
                                </div>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} padding='10px 0px'><Divider /></Grid>
                    <Grid item container xs={12} margin='10px 0px 20px 0px'>
                        <Grid container item xs={12} >
                            <Grid item marginRight='20px'>
                                <Avatar src={avatar}></Avatar>
                            </Grid>
                            <Grid item container padding='5px 10px' minWidth='80%' maxWidth='80%' bgcolor='#f0f2f5' minHeight='50px' borderRadius='10px'>
                                <Grid item xs={12}>
                                    <TextField value={inputStr} onChange={(e) => { setInputStr(e.target.value) }} placeholder='Nhập bình luận' variant='filled' style={{ outline: 'none', width: '95%', border: 'none', backgroundColor: '#f0f2f5' }} inputProps={{
                                        style: { padding: 5 },
                                    }} ></TextField>
                                </Grid>
                                <Grid item container justifyContent='space-between' xs={12} alignItems='center'>
                                    <div onClick={() => { setShowPicker(true) }}>
                                        <SentimentSatisfiedAltIcon fontSize='medium' style={{ position: 'relative', right: '10px', cursor: 'pointer', margin: '4px 10px' }} />
                                    </div>
                                    <div></div>
                                    <div style={{ position: 'fixed', left: '10%', top: '40%', zIndex: '99' }}>
                                        {showPicker && (
                                            <EmojiPicker pickerStyle={{ width: "80%" }} onEmojiClick={onEmojiClick} />
                                        )}
                                    </div>
                                    <div style={{ cursor: 'pointer' }} >
                                        <button onClick={handleComment} style={{ border: 'none' }} disabled={!loaded}>
                                            <SendIcon style={{ color: iconColor }} />
                                        </button>
                                    </div>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} alignItems='flex-start' rowSpacing={2} >
                        {
                            listComment.map((item, index) => (
                                <Grid key={index} container item xs={12} >
                                    <Grid item marginRight='20px'>
                                        <Avatar src={item?.user?.avatar}></Avatar>
                                    </Grid>
                                    <Grid item padding='5px 10px' minWidth='100px' maxWidth='80%' bgcolor='#f0f2f5' minHeight='50px' borderRadius='10px'>
                                        <Link href='/'>
                                            <Typography fontWeight={600}>{item?.user?.name}</Typography>
                                        </Link>
                                        <Typography>
                                            {item?.content}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Detail;