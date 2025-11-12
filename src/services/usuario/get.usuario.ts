import { IUsuario } from "@/types/IUsuario.types";
import api from "../api";

export async function get_usuarios(): Promise<IUsuario[] | undefined>{

    try {

        const resposta: IUsuario[] = await api.get("/usuarios");
        return resposta;
        
    } catch (erro: any) {
      
        console.error(erro);
    };
};

export async function get_usuario(id: number): Promise<IUsuario | undefined>{

    try {

        const resposta: IUsuario | undefined = await api.get(`/usuarios/${id}`);
        return resposta;
        
    } catch (erro: any) {
      
        console.error(erro);
    };
};