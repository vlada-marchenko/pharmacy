'use client'

import { RegisterRequest } from "@/src/lib/auth"
import { register } from '../../lib/auth'
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"


export default function RegisterPage() {
    const router = useRouter()

    const { register: formRegister, handleSubmit } = useForm<RegisterRequest>()

    const onSubmit = async (data: RegisterRequest) => {
        try {
            await register(data)

            toast.success('Registration successful')
            router.push('/login')
        } catch (err) {
            toast.error('Registration failed')
            console.log(err)
        }
}

return (
    <div>
        <h1>Register</h1>
</div>
)
}
