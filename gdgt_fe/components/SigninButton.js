'use client'
import { signIn, useSession } from 'next-auth/react'
import { GoogleIcon, GithubIcon } from './icons/HeaderIcon';
import Api from '../app/api/api.js';

const SigninButton = () => {
    const { data: session } = useSession();
    if (session && session.user) {
        localStorage.setItem('avatar', session.user.image)
        Api.login(session.user.id, session.user.name, session.user.image).then(res => {
            if (res.status === 200) {
                localStorage.setItem('user', res.data.name)
                localStorage.setItem('info', res.data.id)
                localStorage.setItem('account', res.data.account)
                localStorage.setItem('password', res.data.password)
                window.location.href = "/"
            }
        })
        return null
    }
    return (
        <div className="flex items-center justify-around gap-4 w-full">
            <button onClick={() => signIn('google')} className="flex-1 flex items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                <GoogleIcon />
            </button>
            <button onClick={() => signIn('github')} className="flex-1 flex items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                <GithubIcon />
            </button>
            <button onClick={() => signIn('facebook')} className="flex-1 flex items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                <img src='https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg' width='24px' height='24px' alt="Facebook" />
            </button>
        </div>
    );
}

export default SigninButton;