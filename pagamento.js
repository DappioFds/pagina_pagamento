document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const valorDaConstante = params.get('totalAmount');

    // Exibe o valor da constante
    console.log('Valor da constante:', valorDaConstante);
        // Se o valor da constante estiver definido, exibe-o na div Total
        if (valorDaConstante !== null) {
            const valorTotalElement = document.getElementById("Total");
            valorTotalElement.innerText = "R$ " + valorDaConstante;
        }
});
function mostrarOpcaoPagamento(opcao) {
    var opcaoPix = document.getElementById("opcaoPix");
    var opcaoBoleto = document.getElementById("opcaoBoleto");
    var opcaoCartao = document.getElementById("opcaoCartao");

    switch (opcao) {
        case "pix":
            opcaoPix.style.display = "block";
            opcaoBoleto.style.display = "none";
            opcaoCartao.style.display = "none";
            gerarQRCode(); // Função para gerar o QR Code
            break;
        case "boleto":
            opcaoPix.style.display = "none";
            opcaoBoleto.style.display = "block";
            opcaoCartao.style.display = "none";
            gerarNumeroBoleto(); // Função para gerar o número do boleto
            break;
        case "cartao":
            opcaoPix.style.display = "none";
            opcaoBoleto.style.display = "none";
            opcaoCartao.style.display = "block";
            break;
        default:
            break;
    }
}

function gerarQRCode() {
    // Lógica para gerar o QR Code
    var qrCodeImg = document.getElementById("qrCode");
    // Defina a fonte da imagem do QR Code
    qrCodeImg.src = "pix.jfif";
}

function gerarBoletoPDF(numeroAleatorio) {
    // Aqui você irá criar o PDF do boleto com o número fornecido
    // Este é apenas um exemplo simples
    var pdfConteudo = "Número do Boleto: " + numeroAleatorio; // Conteúdo do PDF

    // Cria um blob do conteúdo do PDF
    var blob = new Blob([pdfConteudo], { type: 'application/pdf' });

    // Cria um link para download do blob
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'boleto.pdf'; // Nome do arquivo a ser baixado

    // Adiciona o link à página e simula o clique para iniciar o download
    document.body.appendChild(link);
    link.click();

    // Remove o link da página
    document.body.removeChild(link);
}

function gerarNumeroBoleto() {
    // Gere um número de boleto aleatório, por exemplo:
    var numeroAleatorio = Math.floor(Math.random() * 1000000000000000);
    gerarBoletoPDF(numeroAleatorio); // Gera o boleto em formato PDF e inicia o download
}

// Função para validar o formulário de pagamento
function validarFormularioPagamento() {
    var nome = document.getElementById("nome").value;
    var metodoPagamentoSelecionado = document.querySelector('input[name="metodoPagamento"]:checked').value;

    // Se a opção de pagamento for Pix ou Boleto, não é necessário validar campos adicionais
    if (metodoPagamentoSelecionado === "pix" || metodoPagamentoSelecionado === "boleto") {
        return true;
    }

    var numeroCartao = document.getElementById("cartao").value;
    var validade = document.getElementById("validade").value;
    var cvv = document.getElementById("cvv").value;
    var bandeira = identificarBandeira(numeroCartao);

    if (!bandeira) {
        alert("Número do cartão inválido. Aceitamos apenas Visa, Mastercard ou American Express.");
        return false;
    }
    if (!validarCVV(cvv)) {
        alert("CVV inválido. O CVV deve conter apenas números e ter no máximo 3 dígitos.");
        return false;
    }

    if (!validarNumeroCartao(numeroCartao)) {
        alert("Número do cartão inválido. O número do cartão deve conter apenas números e ter exatamente 16 dígitos.");
        return false;
    }
    if (!validarValidadeCartao(validade)) {
        alert("Data de validade do cartão inválida ou expirada.");
        return false;
    }
    // Verifica se todos os campos do cartão estão preenchidos
    if (nome.trim() === "" || numeroCartao.trim() === "" || validade.trim() === "" || cvv.trim() === "") {
        alert("Por favor, preencha todos os campos.");
        return false;
    }
     // Verifica se o número do cartão possui 16 dígitos
     var numeroCartaoSemEspacos = numeroCartao.replace(/\s/g, '');
     if (numeroCartaoSemEspacos.length !== 16) {
         alert("Número do cartão deve ter 16 dígitos.");
         return false; // Impede o envio do formulário
     }
 
    // Validar o nome
    var mensagemErroNome = validarNome(nome);
    if (mensagemErroNome !== true) {
        document.getElementById("mensagemErroNome").innerText = mensagemErroNome;
        return false;
    } else {
        document.getElementById("mensagemErroNome").innerText = ""; // Limpa a mensagem de erro
        }

    // Função para validar o nome do titular
function validarNome(nome) {
    // Expressão regular para permitir apenas letras e espaços
     regexNome = /^[a-zA-Z\s]+$/;
  
    // Verifica se o nome está vazio
    if (nome === "") {
      return "Nome do titular é obrigatório.";
    }
  
    // Verifica se o nome contém apenas letras e espaços
    if (!regexNome.test(nome)) {
      return "Nome do titular deve conter apenas letras.";
    }
  
    // Verifica se o nome tem mais de 19 caracteres
    if (nome.length > 21) {
      return "Nome do titular deve ter no máximo 19 caracteres.";
    }
  
    // Retorna true se o nome for válido
    return true;
  }
    return true; // Se todos os campos estiverem preenchidos e válidos, retorne true para enviar o formulário
}

  // Função para identificar a bandeira do cartão com base nos primeiros dígitos do número do cartão
  function identificarBandeira(numeroCartao) {
    // Expressões regulares para identificar os primeiros dígitos das bandeiras de cartão
    var regexVisa = /^4/;
    var regexMastercard = /^5[1-5]/;
    var regexAmex = /^3[47]/;

    if (regexVisa.test(numeroCartao)) {
        return "visa";
    } else if (regexMastercard.test(numeroCartao)) {
        return "mastercard";
    } else if (regexAmex.test(numeroCartao)) {
        return "amex";
    } else {
        return null;
    }
   }

// Função para exibir a imagem da bandeira do cartão ao lado do campo do número do cartão

function mostrarbandeira() {
    var numeroCartao = document.getElementById("cartao").value;
    var bandeira = identificarBandeira(numeroCartao);
    var imgBandeira = document.getElementById("bandeiraCartao");

    // Remove todos os espaços do número do cartão
    var numeroCartaoSemEspacos = numeroCartao.replace(/\s/g, '');

    // Aplica a formatação do número do cartão com um espaço a cada 4 dígitos
    var numeroCartaoFormatado = numeroCartaoSemEspacos.replace(/(\d{4})(?=\d)/g, '$1 ');

    // Atualiza o valor do campo de entrada com o número do cartão formatado
    document.getElementById("cartao").value = numeroCartaoFormatado;

    if (bandeira !== null) {
        imgBandeira.src = bandeira + ".png";
        imgBandeira.style.display = "inline-block"; // Exibe a imagem
    } else {
        imgBandeira.style.display = "none"; // Esconde a imagem se a bandeira não for encontrada
    }
}
function calcularFrete() {
    var cep = document.getElementById("cep").value;
    var valorTotalElement = document.getElementById("Total");
    var valorTotal = parseFloat(valorTotalElement.innerText.replace("R$ ", ""));
    
    // Verifica se o CEP está vazio ou se não tem 8 caracteres
    if (cep === "" || cep.length !== 8) {
      // Não altera o valor do frete
      valorTotalElement.innerText = "R$ " + valorTotal.toFixed(2);
    } else {
      // Adiciona R$ 100,00 ao valor total
      valorTotal += 100.00;
      valorTotalElement.innerText = "R$ " + valorTotal.toFixed(2);
    }
  }
function validarCVV(cvv) {
    // Verifica se o CVV contém apenas números
    if (!/^\d+$/.test(cvv)) {
        return false;
    }
    // Verifica se o CVV tem no máximo 3 dígitos
    if (cvv.length > 3) {
        return false;
    }
    return true;
}
function validarNumeroCartao(numeroCartao) {
    // Remove todos os espaços do número do cartão
    numeroCartao = numeroCartao.replace(/\s/g, '');
    // Verifica se o número do cartão contém apenas números
    if (!/^\d+$/.test(numeroCartao)) {
        return false;
    }
    // Verifica se o número do cartão tem exatamente 16 dígitos
    if (numeroCartao.length !== 16) {
        return false;
    }
    return true;
}
function validarValidadeCartao(validade) {
    // Verifica se a validade possui o formato correto "dd/mm/aaaa"
    var regexValidade = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regexValidade.test(validade)) {
        return false; // Formato inválido
    }

    // Divide a string da validade em dia, mês e ano
    var partes = validade.split('/');
    var dia = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10) - 1; // O mês começa em 0 (janeiro)
    var ano = parseInt(partes[2], 10);

    // Verifica se a data é válida usando a função Date
    var dataValidadeCartao = new Date(ano, mes, dia);

    // Obtém o dia, mês e ano atual
    var dataAtual = new Date();
    var diaAtual = dataAtual.getDate();
    var mesAtual = dataAtual.getMonth();
    var anoAtual = dataAtual.getFullYear();

    // Compara a data de validade do cartão com a data atual
    if (
        ano < anoAtual ||
        (ano === anoAtual && mes < mesAtual) ||
        (ano === anoAtual && mes === mesAtual && dia < diaAtual)
    ) {
        return false; // A validade do cartão expirou
    }

    return true; // A validade do cartão é válida
}

function formatarValidadeCartao(input) {
    var valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    var data = '';
    if (valor.length > 0) {
        data = valor.match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
        if (data[1]) data[1] = (data[1].length == 2) ? data[1] + '/' : data[1];
        if (data[2]) data[2] = (data[2].length == 2) ? data[2] + '/' : data[2];
        input.value = data.slice(1, 4).join('');
    }
}

