import { Avatar, Grid, Typography } from "@mui/material";
import Link from "next/link";

function Other({ id, title, youtubeId, name, avatar }) {
    return (
        <div style={{ width: '100%', borderRadius: '10px', display: 'flex', flexDirection: 'row', maxHeight: '153px', cursor: 'pointer', borderBottom: '1px solid #333', borderRight: '1px solid #333', boxShadow: '0px 0px 1px 0px', marginBottom: '5px' }} margin='5px' overflow='hidden' >
            <Link href={`/videos/detail/${id}`}>
                <div style={{ width: '190px', borderRadius: '10px' }} >
                    <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} style={{ borderRadius: '10px' }} ></img>
                </div>
            </Link>
            <Grid item container xs={7} style={{ paddingLeft: '10px', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '3' }}>
                <Grid item xs={12} style={{ paddingTop: '8px', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', lineHeight: '1.6rem', maxHeight: '4.7rem', overflow: 'hidden' }}>
                    <Link href={`/videos/detail/${id}`}>
                        <Typography>
                            {title}
                        </Typography>
                    </Link>
                </Grid>
                <Grid item container alignItems='center' xs={12} style={{ paddingBottom: '10px' }}>
                    <Avatar src={avatar}></Avatar>
                    <Typography fontWeight={600} style={{ paddingLeft: '10px', color: '#1a354a', fontStyle: 'italic' }}>{name}</Typography>
                </Grid>
            </Grid>
        </div >
    );
}

export default Other;