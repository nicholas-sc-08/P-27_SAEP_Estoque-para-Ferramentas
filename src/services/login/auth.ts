import { ILogin } from "@/types/ILogin.types";
import api from "../api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function fazer_login(data: ILogin, router: AppRouterInstance){

    try {

        const resposta = await api.post("/login", data);
        
        if(resposta.status == 401){
            
            localStorage.removeItem("token");
        };
        
        if(resposta){
            
            localStorage.setItem("token", resposta.data.token);
            router.push("/");
            return resposta;
        };

    } catch (erro: any) {
      
        console.error(erro);
    };
};