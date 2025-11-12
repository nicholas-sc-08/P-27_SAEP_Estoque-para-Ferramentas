"use client";

import { get_usuarios } from "@/services/usuario/get.usuario";
import { IUsuario } from "@/types/IUsuario.types";
import { useEffect, useState } from "react";
import { IGlobalContext } from "@/types/IGlobalContext.types";
import { createContext } from "react";
import { useContext } from "react";
import { ReactNode } from "react";

const GlobalContext = createContext<IGlobalContext | null>(null);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {

    const [array_usuarios, set_array_usuarios] = useState<IUsuario[]>([]);
    
    useEffect(() => {

        get_usuarios().then(u => u ? set_array_usuarios(u) : []);

    }, []);

    return (

        <GlobalContext.Provider value={{

            array_usuarios,
            set_array_usuarios,

        }}>{children}</GlobalContext.Provider>
    )
};

export const useGlobalContext = () => {

    const context = useContext(GlobalContext);

    if (!context) {

        throw new Error("global context deve ser usado dentro de um provider");
    };
    return context;
};