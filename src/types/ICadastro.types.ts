import { ROLE } from "@/utils/enum.utils";

export interface ICadastroUsuario {

    nome: string;
    email: string;
    senha: string;
    confirmar_senha: string;
    role: ROLE.usuario | ROLE.instrutor | ROLE.admin;
};