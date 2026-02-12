'use client'

import { LoginRequest } from "@/src/lib/auth"
import { useForm } from "react-hook-form"
import { login } from "@/src/lib/auth"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"


export default function LoginPage() {
    const { register: formRegister, handleSubmit, formState: { errors, isSubmitting }} = useForm<LoginRequest>()
    const router = useRouter()

    const onSubmit = async (data: LoginRequest) => {
        try {
            const res = await login(data)

            Cookies.set('token', res.token, {expires: 1})

            if (res.user.shopId) {
                Cookies.set('shopId', res.user.shopId, { expires: 1})
            }
            localStorage.setItem('user', JSON.stringify(res.user))
            toast.success(`Welcome back, ${res.user.name}`)
            router.push('/shop')
        } catch (err) {
            toast.error('Login failed')
            console.log(err)
        }
        }
    }

