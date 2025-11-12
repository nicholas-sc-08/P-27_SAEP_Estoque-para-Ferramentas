import React from "react";
import { IUsuario } from "./IUsuario.types";

export interface IGlobalContext {

    array_usuarios: IUsuario[] | null,
    set_array_usuarios: React.Dispatch<React.SetStateAction<any>>
};