import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { fazer_login } from "./auth";
import { ILogin } from "@/types/ILogin.types";
import { IUsuario } from "@/types/IUsuario.types";
import React from "react";

export function lidar_com_login(e: React.FormEvent, array_usuarios: IUsuario[] | null, data: ILogin, router: AppRouterInstance) {

    e.preventDefault();

    if (array_usuarios) {

        const usuario_existente = array_usuarios.find(usuario => usuario.email === data.email);

        if (usuario_existente) {

            return null;
        } else {

            fazer_login(data, router);
        };
    }
};