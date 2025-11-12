import { ROLE } from "@/utils/enum.utils";

export interface ILogin {

    email: string;
    senha: string;
    role: ROLE.usuario | ROLE.instrutor | ROLE.admin;
};