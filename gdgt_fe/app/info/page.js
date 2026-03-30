'use client'
import { Avatar, Button, Grid, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Api from '../api/api';

function Info() {
    const [isChanged, setIsChanged] = useState(false)
    const [gender, setGender] = useState(true)
    const [avt, setAvt] = useState('')
    const [file, setFile] = useState()
    const [isposting, setIsposting] = useState(true)
    const [names, setName] = useState('')
    const [password, setPassword] = useState('')
    const [school, setSchool] = useState('')
    const [classs, setClass] = useState('')
    const [email, setEmail] = useState('')
    let name
    try {
        name = localStorage.getItem('info')
    } catch (error) {

    }
    const handleFileChange = (event) => {
        setIsposting(false)
        const selectedFile = event.target.files[0]
        setFile(event.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            setAvt(reader.result); // Lưu URL vào state để hiển thị ảnh
        };
        reader.readAsDataURL(selectedFile);
    }
    const handleChangeAvt = async () => {
        if (file != null) {
            await setIsposting(true)
            await Api.PostImage(file).then((response) => {
                Api.updateAvatar(response.data.url).then(() => {
                    alert('Đổi ảnh đại diện thành công')

                })
            })
            await setIsposting(false)
        }
    }
    useEffect(() => {
        Api.getInfo().then((response) => {
            setAvt(response.data.avatar)
            setGender(response.data.gender)
            setName(response.data.name)
            setPassword(response.data.password)
            setSchool(response.data.school)
            setClass(response.data.ofClass)
            setEmail(response.data.email)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    const updateInfo = async () => {
        await setIsChanged(false)
        await Api.updateInfo(email, password, names, school, avt, gender, classs).then((response) => {
            alert('Cập nhật thành công')
        }).catch((error) => {
            console.log(error)
        }
        )
    }

    return (
        <Grid container style={{ minHeight: '700px', display: 'flex', justifyContent: 'center', width: '100%', padding: '15px 0px' }} bgcolor='#fff'>
            <Grid item container xs={11.5} sm={6} md={4} padding='20px 0px' alignContent='flex-start' rowSpacing={4}>
                <Grid item container xs={12} direction='row' justifyContent='center'>
                    <Typography variant="h5" >Ảnh đại diện</Typography>
                    <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <InputLabel htmlFor="file-input" style={{ cursor: 'pointer' }}>
                            <DriveFileRenameOutlineIcon style={{ fontSize: '30px' }} />
                        </InputLabel>
                        <Input id="file-input" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                    </button>
                </Grid>
                <Grid item container xs={12} justifyContent='space-around'>
                    <Grid item>
                        <Avatar style={{ width: '270px', height: '270px' }} alt="Ảnh đại diện"
                            src={avt} />
                    </Grid>
                </Grid>
                <Grid item container xs={12} justifyContent='space-around'>
                    <Button variant="contained" onClick={handleChangeAvt} disabled={isposting}>Cập nhật</Button>
                </Grid>
            </Grid>
            <Grid item container xs={11.5} sm={6} md={5} padding='20px 0px' marginLeft='20px' >
                <Grid item container >
                    <Grid item xs={12} >
                        <Typography variant="h5">Hồ sơ của tôi</Typography>
                    </Grid>
                    <Grid item xs={12} padding="10px 0px">
                        <TextField
                            label="Email" variant="outlined" style={{ width: '400px', maxWidth: '90%' }}
                            value={email} onChange={(e) => { setEmail(e.target.value), setIsChanged(true) }}
                        />
                    </Grid>
                    <Grid item xs={12} padding="10px 0px">
                        <TextField label="Mật khẩu" variant="outlined" style={{ width: '400px', maxWidth: '90%' }}
                            value={password} onChange={(e) => { setPassword(e.target.value), setIsChanged(true) }}

                        />
                    </Grid>
                    <Grid item xs={12} padding="10px 0px">
                        <TextField label="Họ tên" variant="outlined" style={{ width: '400px', maxWidth: '90%' }}
                            value={names} onChange={(e) => { setName(e.target.value), setIsChanged(true) }}
                        />
                    </Grid>
                    <Grid item xs={12} padding="10px 0px">
                        <TextField label="Trường" variant="outlined" style={{ width: '400px', maxWidth: '90%' }}
                            value={school} onChange={(e) => { setSchool(e.target.value), setIsChanged(true) }}
                        />
                    </Grid>
                    <Grid item xs={12} padding="10px 0px">
                        <TextField label="Lớp" variant="outlined" style={{ width: '400px', maxWidth: '90%' }}
                            value={classs} onChange={(e) => { setClass(e.target.value), setIsChanged(true) }}
                        //    onChange={(e) => { setPhoneNumber(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} padding="10px 0px">
                        <Select
                            value={gender ? 'Nam' : 'Nữ'}
                            onChange={(e) => { setIsChanged(true); setGender(e.target.value == 'Nam' ? true : false) }}
                        >
                            <MenuItem value='Nam'>Nam</MenuItem>
                            <MenuItem value='Nữ'>Nữ</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={updateInfo} variant="contained" disabled={!isChanged} ><Typography>Cập nhật</Typography></Button>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    );
}

export default Info