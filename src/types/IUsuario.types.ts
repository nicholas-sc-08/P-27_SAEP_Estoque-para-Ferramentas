import { ROLE } from "@/utils/enum.utils";

export interface IUsuario {

    id_usuario: number;
    nome: string;
    email: string;
    role: ROLE.usuario;
};

export interface ICreateUsuario {

    nome: string;
    email: string;
    role: ROLE.usuario;
};

export interface IUpdateUsuario {

    nome?: string;
    email?: string;
    role?: ROLE.usuario;
};