'use client'

import { useRouter } from "next/navigation";

export const checkLogin = async () => {
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem('authToken')
    if(token){
        user.role === "ADMIN" ? (router.push('/admin')) : (router.push ('/')) 
    }
}

