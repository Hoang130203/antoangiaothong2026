'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import { FacebookIcon, GithubIcon, GoogleIcon, TwitterIcon } from './icons/HeaderIcon';
import { Grid } from '@mui/material';
import Api from '../app/api/api.js';
const SigninButton = () => {
    const { data: session } = useSession();
    if (session && session.user) {
        //       localStorage.setItem('user', session.user.name)
        localStorage.setItem('avatar', session.user.image)
        //    localStorage.setItem('info', session.user.id)
        Api.login(session.user.id, session.user.name, session.user.image).then(res => {
            if (res.status === 200) {
                console.log("Login success")
                console.log(res.data)
                localStorage.setItem('user', res.data.name)
                localStorage.setItem('info', res.data.id)
                localStorage.setItem('account', res.data.account)
                localStorage.setItem('password', res.data.password)
                window.location.href = "/"
            }
        })
        return
    }
    return (
        <Grid container style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} justifyContent='space-around'>
            <Grid item onClick={() => signIn('google')}>
                <GoogleIcon></GoogleIcon>
            </Grid>
            <Grid item onClick={() => signIn('github')}>
                <GithubIcon></GithubIcon>
            </Grid>
            <Grid item onClick={() => signIn('facebook')}>
                <img src='https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg' width='36px' height='36px'></img>
            </Grid>
            <Grid item onClick={() => signIn('twitter')}>
                <img src='https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg' width='36px' height='36px'></img>
            </Grid>
        </Grid>
    );
}

export default SigninButton;