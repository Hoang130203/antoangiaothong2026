'use client'
import { Box, Button, Grid, Popover, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Link from "next/link";
import { useEffect, useState } from "react";
import AddExam from "./FormAddExam";
import Api from '../api/api';
import dynamic from "next/dynamic";
import FormPost from "../posts/FormCreatePost";
import Rank from './rank';
// import { Document, Page } from "react-pdf";
// const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
//     ssr: false
// });
const image = require('../../public/detailed.png')
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ overflow: 'auto' }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Exams() {
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loaded, setLoaded] = useState(false)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [listExams, setListExams] = useState([]) // [
    const xs = useMediaQuery('(max-width:800px)');
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    try {
        var isAdmin = localStorage.getItem('account') == 'admin' ? true : false;
    } catch (error) {

    }
    const open = Boolean(anchorEl);
    useEffect(() => {
        Api.getListExams().then(res => {
            setListExams(res.data)
            setLoaded(true)
        })
    }, [])

    const [anchorEl1, setAnchorEl1] = useState(Array.from({ length: listExams.length }, () => null)); // Khởi tạo mảng anchorEl1


    const handleClick1 = (event, index) => {
        const newAnchorEl1 = [...anchorEl1]; // Sao chép mảng anchorEl1
        newAnchorEl1[index] = event.currentTarget; // Cập nhật phần tử tương ứng với index
        setAnchorEl1(newAnchorEl1); // Cập nhật mảng anchorEl1
    };

    const handleClose1 = () => {
        setAnchorEl1(Array.from({ length: listExams.length }, () => null)); // Đặt lại tất cả các phần tử trong mảng anchorEl1 là null
    };

    const open1 = Boolean(anchorEl1);
    // const myPdf = '../../public/';
    return (
        <div style={{ minHeight: '800px' }}>
            <Grid container justifyContent='center' width='100%'>
                <div style={{ display: `${loaded ? 'none' : 'fixed'}` }} className="loader_container">
                    <div className="loader_" ></div>
                </div>
                <Grid item container xs={11} md={10}>
                    <Tabs variant={xs ? 'fullWidth' : 'standard'}
                        value={value} onChange={handleChange} style={{ padding: '5px 5px', width: '100%' }}>
                        <Tab label="Trắc nghiệm" {...a11yProps(0)} />
                        <Tab label="File đề thi" {...a11yProps(1)} />
                    </Tabs>
                    <CustomTabPanel value={value} index={0}>
                        <Grid item xs={12} container >
                            {isAdmin &&
                                <Grid item xs={12} container paddingTop='20px'>
                                    <Button onClick={handleClick} variant="contained"><AddIcon />Thêm bài thi</Button>
                                </Grid>
                            }
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
                                <AddExam handleClose={handleClose} />
                            </Popover>
                            {listExams.map((item, index) => (
                                <Grid key={index} margin='10px 15px' marginLeft='0px' item container padding='10px' xs={12} md={5.5} minHeight='200px' borderRadius='5px' bgcolor='#fff' border='1px solid #ccc'>
                                    <Grid item xs={12} container justifyContent='center'>
                                        <Typography variant="h5" textAlign='center' style={{ color: 'red', padding: '0px 5px' }}>{item.name}</Typography>
                                    </Grid>
                                    <Grid item container xs={12} justifyContent='center'>
                                        <p>Thời gian: <span>{item.time} </span> phút</p>
                                    </Grid>
                                    <Grid item xs={12} container justifyContent='center'>
                                        <Typography variant="h6"> <span style={{ color: 'blue' }}></span></Typography>
                                    </Grid>
                                    <Grid container item xs={12} justifyContent='center'>
                                        <Link href={`/exams/${item.id}`}>
                                            <Button style={{ padding: '5px 20px', textTransform: 'none', marginRight: '10px' }} variant="contained"> Làm bài thi</Button>
                                        </Link>
                                        <Link href={`/exams/`}>
                                            <Button color="success" style={{ padding: '5px 10px', textTransform: 'none' }} onClick={(event) => handleClick1(event, index)} variant="contained">Xếp hạng</Button>
                                        </Link>
                                    </Grid>
                                    <Popover
                                        anchorReference="anchorPosition"
                                        anchorPosition={{ top: 300, left: 400 }}
                                        open={Boolean(anchorEl1[index])}
                                        anchorEl={anchorEl1[index]}
                                        onClose={handleClose1}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        style={{ width: '0px', height: '0px' }}
                                    >
                                        <Rank id={item?.id} />
                                    </Popover>
                                </Grid>
                            ))}
                        </Grid>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1} >
                        <h1 style={{ fontSize: '30px' }}>
                            Tài liệu về giáo dục sức khỏe sinh sản
                        </h1>
                        <div>Câu hỏi tìm hiểu về sức khỏe sinh sản &nbsp;&nbsp;
                            <a href='https://docs.google.com/document/d/1GuP1m6OdlHwW4CmkRXBQUqb_LhwnLYT2/edit?usp=sharing&ouid=100393540981120231320&rtpof=true&sd=true'>Tại đây</a>
                        </div>
                        <div>Đáp án tìm hiểu về sức khỏe sinh sản &nbsp;&nbsp;
                            <a href='https://docs.google.com/document/d/1lTMy3M9YwvJwtC11nquDaqBDl7rjEgCP/edit?usp=sharing&ouid=100393540981120231320&rtpof=true&sd=true'>Tại đây</a>
                        </div>
                    </CustomTabPanel>
                </Grid>
            </Grid>
        </div>
    );
}

export default Exams;