'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SigninButton from '../../components/SigninButton';
import Api from '../api/api.js';




const defaultTheme = createTheme();

export default function SignIn() {
    const [account, setAccount] = React.useState('');
    const [password, setPassword] = React.useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            account: data.get('account'),
            password: data.get('password'),
        });
    };
    const handleLogin = () => {
        try {
            Api.login(account, password, '0')
                .then(res => {
                    if (res.status === 200) {
                        console.log("Login success")
                        console.log(res.data)
                        localStorage.setItem('user', res.data.name)
                        localStorage.setItem('info', res.data.id)
                        localStorage.setItem('account', res.data.account)
                        localStorage.setItem('password', res.data.password)
                        localStorage.setItem('avatar', res.data.avatar)
                        window.location.href = "/"
                    }
                    else {
                        alert("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập")
                    }
                }).catch
                (error => {
                    alert("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập")
                })


        } catch (error) {
            alert("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập")
        }
    }
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100vh'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" >
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="account"
                            label="Tài khoản"
                            name="account"
                            autoComplete="account"
                            autoFocus
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mật khẩu"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <SigninButton></SigninButton>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
                        >
                            Đăng nhập
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Quên mật khẩu?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Chưa có tài khoản? Đăng ký"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}