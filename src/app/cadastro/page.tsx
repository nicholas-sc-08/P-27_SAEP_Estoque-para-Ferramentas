"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { ICadastroUsuario } from "@/types/ICadastro.types";
import { ROLE } from "@/utils/enum.utils";
import { useRouter } from "next/navigation";

export default function page() {

    const [formulario, set_formuario] = useState<ICadastroUsuario>({ nome: "", email: "", senha: "", confirmar_senha: "", role: ROLE.usuario });
    const router = useRouter();

    return (

        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign Up to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button className="cursor-pointer" variant="link" onClick={() => router.push("/login")}>Login </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="nome">Nome</Label>
                                <Input value={formulario.nome} onChange={e => set_formuario({ ...formulario, nome: e.target.value })} id="nome" placeholder="Random User" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input value={formulario.email} onChange={e => set_formuario({ ...formulario, email: e.target.value })} id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-2">
                                <div className="">
                                    <Label htmlFor="password">Password</Label>
                                    <Input className="mt-2" placeholder="Insert your password" value={formulario.senha} onChange={e => set_formuario({ ...formulario, senha: e.target.value })} id="password" type="password" required />
                                </div>
                                <div className="flex items-center">
                                    <Input placeholder="Confirm your password" value={formulario.confirmar_senha} onChange={e => set_formuario({ ...formulario, confirmar_senha: e.target.value })} id="password" type="password" required />
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full cursor-pointer mt-5 mb-2">Sign Up</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};