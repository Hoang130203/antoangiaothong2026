'use client'
import { Avatar, Grid, Typography } from '@mui/material';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Other from './otherVideo';
import { useEffect, useRef, useState } from 'react';
import Api from '../../../api/api';
import './stylevideo.css'
function DetailVideo({ params }) {
    console.log(params.id)
    const [video, setVideo] = useState({})
    const [otherVideos, setOtherVideos] = useState([])
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        Api.getVideoById(params.id).then(
            res => {
                setVideo(res?.data)
                setLoaded(true)
            }
        )
    }, [])
    // Thêm một ref cho iframe để có thể truy cập vào nó từ JavaScript
    const iframeRef = useRef(null);

    // Khi component được render, sử dụng useEffect để thực hiện ẩn tiêu đề và các phần tử khác bên trong iframe
    useEffect(() => {
        // Lấy tham chiếu đến iframe
        const iframe = iframeRef.current;

        // Kiểm tra xem iframe có tồn tại không
        if (iframe) {
            // Lấy document bên trong iframe
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            // Tìm và ẩn tiêu đề và các phần tử khác bên trong iframe
            const titleElement = iframeDocument.querySelector('.ytp-title'); // Thay '.title-class' bằng class của tiêu đề
            console.log('see')
            if (titleElement) {
                titleElement.style.display = 'none !important';
            }

            // Tiếp tục tìm và ẩn các phần tử khác nếu cần
        }
    }, []);
    useEffect(() => {
        Api.getAllVideo().then(
            res => {
                if (res.data.length > 5) {
                    console.log(res.data)
                    var list = res.data.slice(0, 5)
                    setOtherVideos(list)
                } else {
                    setOtherVideos(res.data)
                }

            }
        )
    }, [])

    return (
        <div style={{ padding: '20px 0px', justifyContent: 'center', display: 'flex' }}>
            <Grid container item style={{ width: '95%' }}>
                <div style={{ display: `${loaded ? 'none' : 'fixed'}` }} className="loader_container">
                    <div className="loader_" ></div>
                </div>
                <Grid item container xs={12} md={9} justifyContent='flex-start' margin='0px 0px 30px 0px' paddingRight='10px'>
                    <Grid item xs={12} borderRadius='10px' overflow='hidden'>
                        <LiteYouTubeEmbed
                            id={video?.youtubeId}
                            title=""
                            playerClass="lty-playbtn" // Default as "lty-playbtn" to control player button styles
                            wrapperClass="yt-lite"
                            defaultPlay={true}
                            playlist={false}
                            params={{ autoplay: 1, modestbranding: 1 }}
                        />
                    </Grid>
                    <Grid item container xs={12} justifyContent='space-around'>
                        <Grid item xs={12} style={{ textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', lineHeight: '1.6rem', maxHeight: '3.2rem', overflow: 'hidden' }} >
                            <Typography fontWeight={600}>{video?.title}</Typography>
                        </Grid>
                        <Grid item container >
                            <Grid item container overflow='hidden' xs={7} alignItems='center' margin='10px 0px'>
                                <Avatar src={video.owner?.avatar} style={{ border: '1px solid #333', boxShadow: '0px 0px 3px 0px' }} />
                                <Typography variant='h7' fontWeight={600} style={{ paddingLeft: '15px', fontStyle: 'italic' }}>{video.owner?.name}</Typography>
                            </Grid>
                            <Grid item container xs={5} alignItems='center'>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container style={{ display: 'block' }} xs={12} md={3} height='100%' zIndex='10' overflow='hidden' borderRadius='10px' >
                    {otherVideos.map((item, index) => (
                        <Other key={index} name={item?.owner.name} avatar={item?.owner.avatar} id={item?.id} title={item?.title} youtubeId={item?.youtubeId} />
                    ))}
                </Grid>

            </Grid>

        </div>
    );
}

export default DetailVideo;