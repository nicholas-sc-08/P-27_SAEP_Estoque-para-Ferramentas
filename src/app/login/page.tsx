"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { ILogin } from "@/types/ILogin.types";
import { ROLE } from "@/utils/enum.utils";
import { lidar_com_login } from "@/services/login/formulario";
import { useGlobalContext } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";

export default function page() {

    const {array_usuarios, set_array_usuarios} = useGlobalContext();
    const [formulario, set_formuario] = useState<ILogin>({email: "", senha: "", role: ROLE.usuario});
    const router = useRouter();

    return (

        <div className="w-full flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button className="cursor-pointer" variant="link" onClick={() => router.push("/cadastro")}>Sign Up</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={e => lidar_com_login(e, array_usuarios, formulario, router)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input value={formulario.email} onChange={e => set_formuario({...formulario, email: e.target.value})} id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Forgot your password?</Link>
                                </div>
                                <Input value={formulario.senha} onChange={e => set_formuario({...formulario, senha: e.target.value})} id="password" type="password" required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full cursor-pointer mt-5 mb-2">Login</Button>
                        <Button variant="outline" className="w-full cursor-pointer">Login with Google</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};