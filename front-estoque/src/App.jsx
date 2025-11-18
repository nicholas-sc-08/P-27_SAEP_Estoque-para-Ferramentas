// App.jsx — SPA mínima "meia meia meia" (React + axios)
// Entregas: 4 (login), 5 (principal), 6 (cadastro produto), 7 (gestão de estoque)
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 8000,
});

// util
const nao_vazio = (v) => String(v ?? "").trim().length > 0;
const toInt = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

export default function App() {
  // -------------------------------
  // estado global simples
  // -------------------------------
  const [view, set_view] = useState("login"); // 'login' | 'home' | 'ferramentas' | 'estoque'
  const [user, set_user] = useState(null); // {id, nome, email}

  // -------------------------------
  // login (4)
  // -------------------------------
  const [login_email, set_login_email] = useState("");
  const [login_senha, set_login_senha] = useState("");
  const fazer_login = async (e) => {
    e?.preventDefault();
    if (!nao_vazio(login_email) || !nao_vazio(login_senha)) {
      alert("Informe email e senha.");
      return;
    }
    try {
      const { data } = await API.post("/auth/login", {
        email: login_email,
        senha: login_senha,
      });
      set_user(data);
      set_view("home");
      set_login_email("");
      set_login_senha("");
    } catch (err) {
      alert(err?.response?.data?.error || "Falha no login");
    }
  };

  const logout = () => {
    set_user(null);
    set_view("login");
  };

  // -------------------------------
  // ferramentas (6) + uso em estoque (7)
  // -------------------------------
  const [ferramentas, set_ferramentas] = useState([]);
  const [loading_ferramentas, set_loading_ferramentas] = useState(false);
  const [q, setQ] = useState(""); // busca

  // form produto
  const ferramenta_vazia = { id: null, nome: "", quantidade: 0, estoque_minimo: 0, material: "", tamanho: "", modelo: "", marca: "", peso: "", tensao_eletrica: "" };
  const [ferramenta_form, set_ferramenta_form] = useState(ferramenta_vazia);
  const [editando_id, set_editando_id] = useState(null);

  useEffect(() => console.log(ferramenta_form), [ferramenta_form]);

  const carregar_ferramentas = async (term = q) => {
    set_loading_ferramentas(true);
    try {
      const url = nao_vazio(term) ? `/ferramentas?q=${encodeURIComponent(term)}` : "/ferramentas";
      const { data } = await API.get(url);
      set_ferramentas(Array.isArray(data) ? data : []);
    } catch (e) {
      alert("Erro ao carregar ferramentas");
    } finally {
      set_loading_ferramentas(false);
    }
  };

  useEffect(() => {
    if (view === "ferramentas" || view === "estoque") carregar_ferramentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const ferramentas_ordenadas = useMemo(() => {
    // 7.1.1 — ordem alfabética no FRONT (não confiar na ordenação do backend)
    return [...ferramentas].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
  }, [ferramentas]);

  const limpar_ferramenta_form = () => {
    set_ferramenta_form(ferramenta_vazia);
    set_editando_id(null);
  };

  const validar_ferramenta_form = () => {
    const { nome, quantidade, estoque_minimo, material, tamanho, modelo, marca, peso, tensao_eletrica } = ferramenta_form;
    if (!nao_vazio(nome)) return "Informe o nome do produto.";
    if (toInt(quantidade) < 0) return "Quantidade não pode ser negativa.";
    if (toInt(estoque_minimo) < 0) return "Estoque mínimo não pode ser negativo.";
    if(toInt(peso) < 0) return "Peso não pode ser negativo";
    return null;
    // 6.1.6 — validações mínimas
  };

  const criar_ferramenta = async () => {
    const msg = validar_ferramenta_form();
    if (msg) return alert(msg);
    try {
      await API.post("/ferramentas", {
        nome: ferramenta_form.nome.trim(),
        quantidade: toInt(ferramenta_form.quantidade),
        estoque_minimo: toInt(ferramenta_form.estoque_minimo),
        material: ferramenta_form.material.trim(),
        tamanho: ferramenta_form.tamanho.trim(),
        modelo: ferramenta_form.modelo.trim(),
        marca: ferramenta_form.marca.trim(),
        peso: toInt(ferramenta_form.peso),
        tensao_eletrica: toInt(ferramenta_form.tensao_eletrica)
      });
      await carregar_ferramentas();
      limpar_ferramenta_form();
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao criar produto");
    }
  };

  const iniciar_edicao = (p) => {
    set_editando_id(p.id);
    set_ferramenta_form({
      id: p.id,
      nome: p.nome,
      quantidade: p.quantidade,
      estoque_minimo: p.estoque_minimo,
      material: p.material,
      tamanho: p.tamanho,
      modelo: p.modelo,
      marca: p.marca,
      peso: p.peso,
      tensao_eletrica: p.tensao_eletrica
    });
  };

  const salvar_ferramenta = async () => {
    if (!editando_id) return;
    const msg = validar_ferramenta_form();
    if (msg) return alert(msg);
    try {
            
      await API.put(`/ferramentas/${editando_id}`, {
        nome: ferramenta_form.nome.trim(),
        quantidade: toInt(ferramenta_form.quantidade),
        estoque_minimo: toInt(ferramenta_form.estoque_minimo),
        material: ferramenta_form.material.trim(),
        tamanho: ferramenta_form.tamanho.trim(),
        modelo: ferramenta_form.modelo.trim(),
        marca: ferramenta_form.marca.trim(),
        peso: toInt(ferramenta_form.peso),
        tensao_eletrica: toInt(ferramenta_form.tensao_eletrica)
      });
      await carregar_ferramentas();
      limpar_ferramenta_form();
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao salvar ferramenta");
    }
  };

  const excluir_ferramenta = async (id) => {
    if (!window.confirm("Excluir este ferramenta?")) return;
    try {
      await API.delete(`/ferramentas/${id}`);
      await carregar_ferramentas();
      // 6.1.5 — excluir
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao excluir ferramenta");
    }
  };

  const buscar = async (e) => {
    e?.preventDefault();
    await carregar_ferramentas(q);
    // 6.1.2 — busca atualiza a listagem
  };

  // -------------------------------
  // gestão de estoque (7)
  // -------------------------------
  const [mov_ferramenta_id, set_mov_ferramenta_id] = useState("");
  const [mov_tipo, set_mov_tipo] = useState("entrada"); // entrada|saida
  const [mov_quantidade, set_mov_quantidade] = useState("");
  const [mov_data, set_mov_data] = useState(""); // date (yyyy-mm-dd)
  const [mov_obs, set_mov_obs] = useState("");

  const enviar_movimentacao = async () => {
    if (!user) return alert("Faça login.");
    if (!mov_ferramenta_id) return alert("Selecione uma ferramenta.");
    if (!["entrada", "saida"].includes(mov_tipo)) return alert("Tipo inválido.");
    const qtd = toInt(mov_quantidade);
    if (!(qtd > 0)) return alert("Informe uma quantidade > 0.");

    try {
      const payload = {
        ferramenta_id: Number(mov_ferramenta_id),
        usuario_id: user.id,
        tipo: mov_tipo,
        quantidade: qtd,
        data_movimentacao: nao_vazio(mov_data) ? new Date(mov_data).toISOString() : null, // 7.1.3
        observacao: nao_vazio(mov_obs) ? mov_obs.trim() : null,
      };
      const { data } = await API.post("/movimentacoes", payload);
      // data.ferramenta.abaxo_do_minimo (do backend)
      alert("Movimentação registrada com sucesso.");
      if (data?.ferramenta?.abaixo_do_minimo) {
        alert("⚠️ Estoque abaixo do mínimo para este ferramenta!");
      }
      // atualizar listagem para refletir novo saldo
      await carregar_ferramentas();
      // limpar form
      set_mov_quantidade("");
      set_mov_obs("");
      // manter ferramenta/tipo/data para facilitar uso contínuo
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao registrar movimentação");
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="app-container">
      <h1>Ferramentas e Equipamentos Manuais — Gestão de Estoque</h1>

      {/* LOGIN (4) */}
      {view === "login" && (
        <section className="form" aria-label="login">
          <h2>Login</h2>
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              value={login_email}
              onChange={(e) => set_login_email(e.target.value)}
              placeholder="ana@example.com"
              required
            />
          </div>
          <div className="input-container">
            <label>Senha</label>
            <input
              type="password"
              value={login_senha}
              onChange={(e) => set_login_senha(e.target.value)}
              placeholder="•••••••"
              required
            />
          </div>
          <button onClick={fazer_login}>Entrar</button>
        </section>
      )}

      {/* HOME (5) */}
      {view === "home" && (
        <section className="form" aria-label="home">
          <h2>Olá, {user?.nome}</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => set_view("ferramentas")}>Cadastro de Ferramenta</button>
            <button onClick={() => set_view("estoque")}>Gestão de Estoque</button>
            <button onClick={logout}>Sair</button>
          </div>
        </section>
      )}

      {/* CADASTRO DE PRODUTO (6) */}
      {view === "ferramentas" && (
        <section className="form" aria-label="ferramentas">
          <h2>Cadastro de Ferramenta</h2>

          {/* busca (6.1.2) */}
          <form onSubmit={buscar} style={{ width: "100%", display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Buscar por nome (ex.: arrastão)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit">Buscar</button>
            <button type="button" onClick={() => { setQ(""); carregar_ferramentas(""); }}>
              Limpar
            </button>
          </form>

          {/* form criar/editar (6.1.3–6.1.4–6.1.6) */}
          <div style={{ width: "100%", display: "grid", gap: 8 }}>
            <div className="input-container">
              <label>Nome</label>
              <input
                type="text"
                value={ferramenta_form.nome}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, nome: e.target.value }))}
                placeholder='ex.: "ferramenta ZY"'
                required
              />
            </div>
            <div className="input-container">
              <label>Quantidade</label>
              <input
                type="number"
                value={ferramenta_form.quantidade}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, quantidade: e.target.value }))}
                min={0}
              />
            </div>
            <div className="input-container">
              <label>Estoque mínimo</label>
              <input
                type="number"
                value={ferramenta_form.estoque_minimo}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, estoque_minimo: e.target.value }))}
                min={0}
              />
            </div>
            <div className="input-container">
              <label>Material</label>
              <input
                type="text"
                value={ferramenta_form.material}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, material: e.target.value }))}
              />
            </div>
            <div className="input-container">
              <label>Tamanho</label>
              <input
                type="text"
                value={ferramenta_form.tamanho}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, tamanho: e.target.value }))}
              />
            </div>
            <div className="input-container">
              <label>Modelo</label>
              <input
                type="text"
                value={ferramenta_form.modelo}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, modelo: e.target.value }))}
              />
            </div>
            <div className="input-container">
              <label>Marca</label>
              <input
                type="text"
                value={ferramenta_form.marca}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, marca: e.target.value }))}
              />
            </div>
            <div className="input-container">
              <label>Peso</label>
              <input
                type="number"
                value={ferramenta_form.peso}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, peso: e.target.value }))}
              />
            </div>
            <div className="input-container">
              <label>Tensão Elétrica</label>
              <input
                type="number"
                value={ferramenta_form.tensao_eletrica}
                onChange={(e) => set_ferramenta_form((s) => ({ ...s, tensao_eletrica: e.target.value }))}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {editando_id ? (
                <>
                  <button type="button" onClick={salvar_ferramenta}>Salvar alterações</button>
                  <button type="button" onClick={limpar_ferramenta_form}>Cancelar</button>
                </>
              ) : (
                <button type="button" onClick={criar_ferramenta}>Cadastrar Ferramenta</button>
              )}
              <button type="button" onClick={() => set_view("home")}>Voltar</button>
            </div>
          </div>

          {/* listagem (6.1.1) — em tabela; (6.1.5) excluir; editar */}
          <div style={{ width: "100%", marginTop: 10 }}>
            {loading_ferramentas && <p>Carregando...</p>}
            {!loading_ferramentas && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Nome</th>
                    <th>Qtd</th>
                    <th>Mín</th>
                    <th>Alerta</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ferramentas_ordenadas.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td style={{ textAlign: "center" }}>{p.quantidade}</td>
                      <td style={{ textAlign: "center" }}>{p.estoque_minimo}</td>
                      <td style={{ textAlign: "center" }}>
                        {p.quantidade < p.estoque_minimo ? "⚠️" : "—"}
                      </td>
                      <td style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button type="button" onClick={() => iniciar_edicao(p)}>Editar</button>
                        <button type="button" onClick={() => excluir_ferramenta(p.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                  {ferramentas_ordenadas.length === 0 && (
                    <tr><td colSpan={5}>Nenhum produto.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* GESTÃO DE ESTOQUE (7) */}
      {view === "estoque" && (
        <section className="form" aria-label="estoque">
          <h2>Gestão de Estoque</h2>

          {/* listagem alfabética (7.1.1) */}
          <div style={{ width: "100%" }}>
            <h3>Ferramentas (ordem alfabética)</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {ferramentas_ordenadas.map((p) => (
                <li key={p.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ width: "50%" }}>{p.nome}</span>
                  <span>Qtd: <b>{p.quantidade}</b></span>
                  <span>Mín: <b>{p.estoque_minimo}</b></span>
                  <span>{p.quantidade < p.estoque_minimo ? "⚠️ Baixo" : ""}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* formulário de movimentação (7.1.2–7.1.3–7.1.4) */}
          <div style={{ width: "100%", marginTop: 10 }}>
            <h3>Registrar movimentação</h3>
            <div className="input-container">
              <label>Ferramenta</label>
              <select
                value={mov_ferramenta_id}
                onChange={(e) => set_mov_ferramenta_id(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
              >
                <option value="">Selecione...</option>
                {ferramentas_ordenadas.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div className="input-container">
              <label>Tipo</label>
              <div style={{ display: "flex", gap: 10 }}>
                <label><input type="radio" name="tipo" value="entrada" checked={mov_tipo === "entrada"} onChange={(e) => set_mov_tipo(e.target.value)} /> Entrada</label>
                <label><input type="radio" name="tipo" value="saida" checked={mov_tipo === "saida"} onChange={(e) => set_mov_tipo(e.target.value)} /> Saída</label>
              </div>
            </div>

            <div className="input-container">
              <label>Quantidade</label>
              <input
                type="number"
                min={1}
                value={mov_quantidade}
                onChange={(e) => set_mov_quantidade(e.target.value)}
                placeholder="Ex.: 5"
              />
            </div>

            <div className="input-container">
              <label>Data da movimentação</label>
              <input
                type="date"
                value={mov_data}
                onChange={(e) => set_mov_data(e.target.value)}
              />
            </div>

            <div className="input-container">
              <label>Observação (opcional)</label>
              <input
                type="text"
                value={mov_obs}
                onChange={(e) => set_mov_obs(e.target.value)}
                placeholder="Ex.: retirada para feira"
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={enviar_movimentacao}>Registrar</button>
              <button type="button" onClick={() => set_view("home")}>Voltar</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
