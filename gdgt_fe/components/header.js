'use client'
import PersonIcon from '@mui/icons-material/Person';
import './component.css'
import { Avatar, Badge, Button, Divider, MenuItem, Popover, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { Notification } from './icons/HeaderIcon';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';
function Header() {
    const handleLogout = async () => {
        try {
            await localStorage.removeItem('user')
            await localStorage.removeItem('avatar')
            await signOut({ redirect: false })
            window.location.href = '/login'
        } catch (error) {

        }

    }
    let avatar, user
    try {
        avatar = localStorage.getItem('avatar')
        user = localStorage.getItem('user')
    } catch (error) {

    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const [show, setShow] = useState(false)
    const handleshow = () => {
        setShow(!show)
    }

    const [anchorEl2, setAnchorEl2] = useState(null);

    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const open2 = Boolean(anchorEl2);



    return (
        <div className='header-wrapper'>

            <nav className="navbar is-white topNav" style={{ width: '100%' }}>
                <div className="container" style={{ width: '100%' }}>
                    <div className="navbar-brand" >
                        <Link className="navbar-item" href="/" style={{ marginRight: '30px' }}>
                            <img src="https://png.pngtree.com/png-vector/20190729/ourlarge/pngtree-arrows-career-direction-employee-human-person-ways-abstrac-png-image_1623923.jpg" style={{ maxHeight: '40px' }} />
                        </Link>
                        <div className={`navbar-burger burger ${show ? 'is-active' : ''}`} data-target="topNav"
                            onClick={handleshow}

                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div id="topNav" className={`navbar-menu ${show ? 'is-active' : ''}`}>
                        <div className="navbar-start" >
                            <Link className="navbar-item" href="/">Trang chủ</Link>
                            <Link className="navbar-item" href="/posts">Bài viết</Link>
                            <Link className="navbar-item" href="/videos">Video</Link>
                            <Link className="navbar-item" href="/images">Hình ảnh</Link>
                            <Link className="navbar-item" href="/documents">Tài liệu</Link>
                        </div>
                        <div className="navbar-end">
                            {typeof window !== 'undefined' && !localStorage.getItem('user') ?
                                <div className="navbar-item">
                                    <div className="field is-grouped">
                                        <p className="control">
                                            <Link href='/signup' className="button is-small">
                                                <span className="icon">
                                                    <i className="fa fa-user-plus"></i>
                                                </span>
                                                <span>
                                                    Đăng ký
                                                </span>
                                            </Link>
                                        </p>
                                        <p className="control">
                                            <Link href='/login' className="button is-small is-info is-outlined">
                                                <span className="icon">
                                                    <i className="fa fa-user"></i>
                                                </span>
                                                <span onClick={signOut({ redirect: false })}>Đăng nhập</span>
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                :
                                <div className="field is-grouped" style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '22px', backgroundColor: '#e4e6eb', display: 'flex',
                                        justifyContent: 'center', alignItems: 'center', cursor: 'pointer', margin: '5px 20px 5px 10px'
                                    }} onClick={handleClick2}>
                                        <Badge badgeContent={4} color="primary" max={99} size="small" style={{ padding: '4px' }}>
                                            <Notification />
                                        </Badge>
                                    </div>
                                    <Popover
                                        open={open2}
                                        anchorEl={anchorEl2}
                                        onClose={handleClose2}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
                                    </Popover>
                                    <div onClick={handleClick}>
                                        <Avatar style={{ width: '42px', height: '42px', cursor: 'pointer' }}
                                            src={avatar ?? 'https://minhtuanmobile.com/uploads/blog/tong-hop-genshin-impact-4-3-moi-nhat-231209033334.jpg'} /></div>
                                    <Popover
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <div style={{ width: '280px', padding: '10px 0px' }}>
                                            <Link href='/info' style={{ color: 'black' }}>
                                                <MenuItem style={{ height: '50px' }}>
                                                    <Avatar style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                                                        src={avatar ?? 'https://minhtuanmobile.com/uploads/blog/tong-hop-genshin-impact-4-3-moi-nhat-231209033334.jpg'} />
                                                    <Typography variant='h6' style={{ paddingLeft: '12px' }}>{user ?? "Mai Minh Hoàng"}</Typography>
                                                </MenuItem>
                                            </Link>
                                            <Divider />
                                            <Link href='/friends' style={{ color: '#333' }}>
                                                <MenuItem>
                                                    <PeopleAltIcon></PeopleAltIcon>
                                                    <Typography variant='h7' style={{ paddingLeft: '12px' }}>Bạn bè</Typography>
                                                </MenuItem>
                                            </Link>
                                            <MenuItem>
                                                <RateReviewIcon />
                                                <Typography variant='h7' style={{ paddingLeft: '12px' }}>Đóng góp ý kiến</Typography>
                                            </MenuItem>
                                            <MenuItem style={{ marginTop: '10px' }} onClick={handleLogout}>
                                                <LogoutIcon />
                                                <Typography variant='h6' style={{ paddingLeft: '12px' }}>Đăng xuất</Typography>
                                            </MenuItem>
                                        </div>
                                    </Popover>
                                </div>
                            }
                        </div>
                    </div>
                </div >
            </nav >
        </div >
    );
}

export default Header;