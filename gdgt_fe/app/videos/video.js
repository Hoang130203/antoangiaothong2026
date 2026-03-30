import { Avatar, Grid } from "@mui/material";
import Link from "next/link";
import styles from './video.module.css'

function Video({ id, title, avatar, youtubeId }) {
    return (
        <Grid container item xs={12} sm={6} md={4} minHeight='200px' maxHeight='350px'>
            <Grid container item margin='10px' overflow='hidden'>
                <div style={{ width: '100%', paddingBottom: '75%', position: 'relative', maxHeight: '250px' }}>
                    <Link href={`videos/detail/${id}`}>
                        <img
                            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt="Sample"
                            className={styles.img_video}
                        />
                    </Link>
                </div>
                <div style={{ display: 'flex', padding: '10px', width: '100%' }}>
                    <Grid item xs={1.6} md={1.5} >
                        <Avatar style={{ width: '36px', height: '36px', cursor: 'pointer' }} src={avatar}></Avatar>
                    </Grid>
                    <Grid item xs={10} md={10.5} style={{ flex: '1', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', lineHeight: '1.6rem', maxHeight: '3.2rem', overflow: 'hidden', }}>
                        <Link href={`videos/detail/${id}`}>
                            <p style={{ fontSize: '16px', textAlign: 'start', fontWeight: '600', paddingLeft: '10px', color: '#333' }}>
                                {title}
                            </p>
                        </Link>
                    </Grid>
                </div>

            </Grid>
        </Grid>
    );
}

export default Video;