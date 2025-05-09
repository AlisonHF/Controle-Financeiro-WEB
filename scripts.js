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

    function criaOuAlteraId() {
        if (localStorage.getItem('id') === null) {
            console.log('ID criado');
            localStorage.setItem('id', 0);
            return 0;
        }

        else {
            let proximo_id = parseInt(localStorage.getItem('id')) + 1;
            localStorage.setItem('id', proximo_id);
            return proximo_id;
        }
    }

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

        // Pega os valores preenchidos
        preencherFormulario();

        // Verifica os campos
        let data_valido = formulario.validarData();
        let tipo_valido = formulario.validarTipo();
        let descricao_valido = formulario.validarDescricao();
        let valor_valido = formulario.validarValor();


        // Se válido 
        if (data_valido && tipo_valido && descricao_valido && valor_valido) {
            console.log('Formulário válido');

            // Cria um objeto que salva os dados do formulário
            let dados_form = {
                data: formatarData(formulario.data),
                tipo: formulario.tipo,
                descricao: formulario.descricao,
                valor : formatarValor(formulario.valor)
            }

            localStorage.setItem(criaOuAlteraId(), JSON.stringify(dados_form));

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

    let dados_tabela = document.getElementById('dados_tabela');
    let ultimo_id = localStorage.getItem('id');

    function consultaDespesas() {
        for(let x = 0; x <= ultimo_id; x++){

            let despesa_atual = JSON.parse(localStorage.getItem(x));

            if (despesa_atual === null) {
                console.log('Despesa vazia');
                continue;
            }

            let botao_exclusao = document.createElement('button');
            botao_exclusao.className = 'btn btn-danger';
            botao_exclusao.innerHTML = 'X';
            botao_exclusao.onclick = function() {
                localStorage.removeItem(x)
            };


            let linha = dados_tabela.insertRow();
            let tipo = linha.insertCell(0);
            let descricao = linha.insertCell(1);
            let valor = linha.insertCell(2);
            let data = linha.insertCell(3);
            linha.insertCell(4).append(botao_exclusao);

            tipo.innerHTML = despesa_atual.tipo;
            descricao.innerHTML = despesa_atual.descricao;
            valor.innerHTML = despesa_atual.valor;
            data.innerHTML = despesa_atual.data;
            
        }
    }
}
