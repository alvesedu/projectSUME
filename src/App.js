import './App.css';
import React, { useState } from 'react';


function App() {
  const [form, setForm] = useState({
    tipoLancamento: '',
    postoGraduacao: '',
    nome: '',
    dataDoFato: '',
    turno: '',
    pelotao: '',
    aluno: '',
    registroAluno: '',
    justificativa: ''
  });

  const [registros, setRegistros] = useState([]);
  const [step, setStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    let canProceed = false;

    console.log("Form data: ", form);

    switch (step) {
      case 1:
        canProceed = form.tipoLancamento && form.postoGraduacao && form.nome;
        break;
      case 2:
        canProceed = form.dataDoFato && form.turno;
        break;
      case 3:
        canProceed = form.pelotao;
        break;
      case 4:
        canProceed = form.aluno;
        break;
      case 5:
        canProceed = form.registroAluno;
        if (form.registroAluno === 'FALTAS') {
          setStep(6);
          return;
        }
        break;
      case 6:
        canProceed = form.justificativa;
        break;
        break;
      default:
        canProceed = false;
    }

    if (canProceed) {
      setStep(prevStep => prevStep + 1);
    } else {
      alert("Preencha todos os campos obrigatórios antes de prosseguir!");
    }
  };

  const handleBack = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleEdit = (id) => {
    const registroAEditar = registros.find(registro => registro.id === id);
    setRegistroEditando(registroAEditar);
    setForm(registroAEditar); // Carrega o registro no formulário
    setEditMode(true); // Ativa o modo de edição
    setStep(1); // Inicia a edição no primeiro passo
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza de que deseja excluir este registro?")) {
      setRegistros(prevRegistros => prevRegistros.filter(registro => registro.id !== id));
    }
  };

  const handleSave = () => {
    if (editMode && registroEditando) { // Se estiver no modo de edição
      setRegistros(prevRegistros => {
        return prevRegistros.map(registro =>
          registro.id === registroEditando.id ? form : registro
        );
      });
      setEditMode(false);
      setRegistroEditando(null);
    } else { // Caso contrário, adicione um novo registro
      const newRegistro = { ...form, id: Date.now() };
      setRegistros(prevRegistros => [...prevRegistros, newRegistro]);
    }

    // Resete o formulário e retorne ao step 1 em ambos os casos
    setForm({
      tipoLancamento: '',
      postoGraduacao: '',
      nome: '',
      dataDoFato: '',
      turno: '',
      pelotao: '',
      aluno: '',
      registroAluno: '',
      justificativa: ''
    });
    setStep(1);
  };


  const pelotoes = {
    '6º ANO ALPHA': ['ALIPIO', 'AMANDA', 'ANA'],
    '6º ANO BRAVO': ['JOÃO', 'MARIA', 'PEDRO'],
    '6º ANO CHARLIE': ['ALIPIO', 'AMANDA', 'ANA'],
    '6º ANO DELTA': ['JOÃO', 'MARIA', 'PEDRO'],
    '6º ANO ECHO': ['JOÃO', 'MARIA', 'PEDRO'],
    '6º ANO FOXTROT': ['JOÃO', 'MARIA', 'PEDRO'],
  };

  const pelotoesManha = ['6º ANO ALPHA', '6º ANO BRAVO', '6º ANO CHARLIE'];
  const pelotoesTarde = ['6º ANO DELTA', '6º ANO ECHO', '6º ANO FOXTROT'];



  return (
    <div>
      <form>
        {step === 1 && (
          <div>
            <label>Tipo de Lançamento:</label>
            <select name="tipoLancamento" onChange={handleChange} required>
              <option value="">Selecione uma opção</option>
              <option value="ALTERAÇÕES ALUNOS">ALTERAÇÕES ALUNOS</option>
              <option value="ALTERAÇÃO PROFESSORES">ALTERAÇÃO PROFESSORES</option>
              <option value="Nº ALUNOS PRESENTES">Nº ALUNOS PRESENTES</option>
            </select>

            <label>Posto/Graduação:</label>
            <select name="postoGraduacao" onChange={handleChange} required>
              <option value="">Selecione uma opção</option>
              <option value="SD">SD</option>
              <option value="CB">CB</option>
              <option value="SGT">SGT</option>
            </select>

            <label>Nome:</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required />

            {/* <button onClick={handleBack}>Voltar</button> */}
            <button onClick={handleNext}>Próximo</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label>Data do Fato:</label>
            <input type="date" name="dataDoFato" value={form.dataDoFato} onChange={handleChange} required />

            <label>Turno:</label>
            <select name="turno" onChange={handleChange} required>
              <option value="">Selecione uma opção</option>
              <option value="MANHÃ">MANHÃ</option>
              <option value="TARDE">TARDE</option>
            </select>

            <button onClick={handleBack}>Voltar</button>
            <button onClick={handleNext}>Próximo</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>Pelotão do Aluno:</label>
            <select name="pelotao" onChange={handleChange} required>
              <option value="">Selecione o pelotão</option>

              {form.turno === 'MANHÃ' && pelotoesManha.map(pelotao => (
                <option key={pelotao} value={pelotao}>{pelotao}</option>
              ))}

              {form.turno === 'TARDE' && pelotoesTarde.map(pelotao => (
                <option key={pelotao} value={pelotao}>{pelotao}</option>
              ))}

            </select>
            <button onClick={handleBack}>Voltar</button>
            <button onClick={handleNext}>Próximo</button>
          </div>
        )}

        {step === 4 && form.pelotao && (
          <div>
            <label>Aluno do {form.pelotao}:</label>
            <select name="aluno" onChange={handleChange} required>
              <option value="">Selecione o aluno</option>

              {pelotoes[form.pelotao].map(aluno => (
                <option key={aluno} value={aluno}>{aluno}</option>
              ))}

            </select>
            <button onClick={handleBack}>Voltar</button>
            <button onClick={handleNext}>Próximo</button>
          </div>
        )}



        {step === 5 && (
          <div>
            <label>O que deseja registrar?</label>
            <select name="registroAluno" onChange={handleChange} required>
              <option value="">Selecione uma opção</option>
              <option value="FALTAS">FALTAS</option>
              <option value="NÃO PARTICIPAR DE ATIVIDADE">NÃO PARTICIPAR DE ATIVIDADE</option>
              <option value="FO+">FO+</option>
              <option value="FO-">FO-</option>
            </select>
            <button onClick={handleBack}>Voltar</button>
            <button onClick={handleNext}>Próximo</button>
          </div>
        )}


        {step === 6 && form.registroAluno === 'FALTAS' && (
          <div>
            <label>Justificativa:</label>
            <select name="justificativa" onChange={handleChange} required>
              <option value="">Selecione uma justificativa</option>
              <option value="INFORMADA">INFORMADA</option>
              <option value="NÃO INFORMADA">NÃO INFORMADA</option>
              <option value="FALTA JUSTIFICADA">FALTA JUSTIFICADA</option>
            </select>
            <button onClick={handleBack}>Voltar</button>
            <button onClick={handleSave}>Salvar</button>
          </div>
        )}




        {/* ... Continue com os demais steps ... */}

        {editMode && step === 6 && (
          <button onClick={handleSave}>Salvar</button>
        )}
      </form>

      <table className="table-container">
        <thead>
          <tr>
            <th className="tipoLancamento">Tipo de Lançamento</th>
            <th className="postoGraduacao">Posto/Graduação</th>
            <th>Nome</th>
            <th>Data do Fato</th>
            <th>Turno</th>
            <th>Pelotão</th>
            <th className="nomeAluno">Nome do Aluno</th>
            <th className="registroAluno">Registro do Aluno</th>
            <th>Justificativa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {registros.map(registro => (
            <tr key={registro.id}>
              <td className="tipoLancamento">{registro.tipoLancamento}</td>
              <td className="postoGraduacao">{registro.postoGraduacao}</td>
              <td>{registro.nome}</td>
              <td>{registro.dataDoFato}</td>
              <td>{registro.turno}</td>
              <td>{registro.pelotao}</td>
              <td className="nomeAluno">{registro.aluno}</td>
              <td className="registroAluno">{registro.registroAluno}</td>
              <td>{registro.justificativa}</td>
              <td>
                <button onClick={() => handleEdit(registro.id)}>Editar</button>
                <button onClick={() => handleDelete(registro.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
