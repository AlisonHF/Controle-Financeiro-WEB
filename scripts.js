if (document.body.id === "pagina-adicionar") {

    // Objetos
    class MensagemErro {
        constructor(mensagem_recebida, id) {
            this.mensagem = '<i class="fa-solid fa-circle-exclamation"></i> ' + mensagem_recebida;
            this.id = id;
            this.local_validador = document.getElementById('espaco-validador');
        }

        criarMensagem() {
            let mensagem_validacao = document.createElement('p');
            mensagem_validacao.id = this.id;
            mensagem_validacao.innerHTML = this.mensagem;
            this.local_validador.appendChild(mensagem_validacao);
        }
    }



    let formulario = {
        data: '',
        tipo:'',
        descricao: '',
        valor: '',

        mensagem_data : new MensagemErro('O campo data é obrigatório!', 'data'),
        mensagem_tipo : new MensagemErro('O campo tipo é obrigatório!', 'tipo'),
        mensagem_descricao : new MensagemErro('O campo descrição deve ter mais de 2 caracteres!', 'descricao'),
        mensagem_valor : new MensagemErro('O campo valor é obrigatório e não pode ser negativo!', 'valor'),

        // Funções de validação campos
        validarData: function() {
            if (this.data === "") {
                this.mensagem_data.criarMensagem();
                return false;
            }
            return true;
        },

        validarTipo: function() {
            if (this.tipo === "") {
                this.mensagem_tipo.criarMensagem();
                return false;
            }
            return true;
        },

        validarDescricao: function() {
            if (this.descricao.length < 2) {
                this.mensagem_descricao.criarMensagem();
                return false;
            }
            return true;
        },

        validarValor: function() {
            if (this.valor <= 0) {
                this.mensagem_valor.criarMensagem();
                return false;
            }
            return true;
        }
    };



    // Funções
    let formularios_enviados = Array();

    // Função preencher formulario com os dados do cliente
    function preencherFormulario() {
        formulario.data = document.getElementById('data').value;
        formulario.tipo = document.getElementById('tipo').value;
        formulario.descricao = document.getElementById('descricao').value.trim();
        formulario.valor = document.getElementById('valor').value.trim();
        }

    // Função de validação do dados
    function validarEnviar() {

        // Limpa as validações anteriores
        let div_validador = document.getElementById('espaco-validador');
        div_validador.innerHTML = '';

        preencherFormulario();

        let data_valido = formulario.validarData();
        let tipo_valido = formulario.validarTipo();
        let descricao_valido = formulario.validarDescricao();
        let valor_valido = formulario.validarValor();

        if (data_valido && tipo_valido && descricao_valido && valor_valido) {
            console.log('Formulário válido');

            // Cria um objeto que salva os dados do formulário
            let dados_form = {
                data: formatarData(formulario.data),
                tipo: formulario.tipo,
                descricao: formulario.descricao,
                valor : formatarValor(formulario.valor)
            }

            // Cria um Array que pega todos os dados já salvos no local storage
            let dados_salvos = localStorage.getItem('formularios');
            let formularios_enviados = dados_salvos ? JSON.parse(dados_salvos) : []; // Pega os dados que estão no local storage que são strings e converte para array

            formularios_enviados.push(dados_form); // Cria um novo formulario e coloca no array

            localStorage.setItem('formularios', JSON.stringify(formularios_enviados)); // Envia para o localstorage

            limparCampos()

            alert('Formulário enviado com sucesso!');

        }
    };

    // Formata a data 
    function formatarData(data) {
        let array_data = [...data];
        let ano = `${array_data[0]}${array_data[1]}${array_data[2]}${array_data[3]}`;
        let mes = `${array_data[5]}${array_data[6]}`;
        let dia = `${array_data[8]}${array_data[9]}`;

        return (`${dia}/${mes}/${ano}`);
    }

    // Formata valor para reais
    function formatarValor(valor) {
        // Cria uma váriavel formatadora com um objeto de formatação
        const formatador_valor = Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        } );

        return formatador_valor.format(valor);
    }

    // Limpar campos
    function limparCampos() {
        document.getElementById('data').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('descricao').value = '';
        document.getElementById('valor').value = '';
    }
}



// --- Página consultar ---



else if (document.body.id === "pagina-consultar") {

    const corpo_tabela = document.getElementById('tabela-corpo');
    let dados_tabela = document.getElementById('tabela-dados');
    const dados_brutos = localStorage.getItem('formularios');
    let array = JSON.parse(dados_brutos);

    function mostrarDespesas() {
        if (array === null){
            corpo_tabela.innerHTML = '<h2 class="mensagem-aviso-consulta">Sem dados para mostrar, cadastre os dados para ver nessa tela!</h2>';
        } else {
            array.forEach((objeto) => {
                dados_tabela.innerHTML += `<tr>
                <td>${objeto.tipo}</th>
                <td>${objeto.descricao}</th>
                <td>${objeto.valor}</th>
                <td>${objeto.data}</th>
                </tr>`
            });
        }
        
    }

}