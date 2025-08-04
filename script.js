document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('ugrowthForm');
    const stepContainer = document.getElementById('form-step-container');
    
    // Armazena todas as respostas do usuário
    let formData = {};
    let currentStep = 0;

    // Função para renderizar o passo atual no formulário
    const renderStep = () => {
        // Limpa o conteúdo anterior
        stepContainer.innerHTML = '';
        const step = steps[currentStep];

        // Cria o elemento do passo e adiciona o conteúdo
        const stepDiv = document.createElement('div');
        stepDiv.className = 'form-step';

        let content = '';

        // Gera o HTML para cada tipo de passo
        if (step.type === 'intro' || step.type === 'info' || step.type === 'final') {
            content = step.content;
        } else {
            content += `<label for="${step.id}">${step.label.replace('(nome da empresa)', formData.nome_empresa || 'sua empresa').replace('(nome)', formData.nome || 'você')}</label>`;
            
            if (step.type === 'text' || step.type === 'email' || step.type === 'tel') {
                content += `<input type="${step.type}" id="${step.id}" name="${step.id}" required>`;
            } else if (step.type === 'radio') {
                content += '<div class="radio-options">';
                step.options.forEach(option => {
                    content += `
                        <label>
                            <input type="radio" name="${step.id}" value="${option}" required>
                            <span>${option}</span>
                        </label>
                    `;
                });
                content += '</div>';
            }
        }
        
        stepDiv.innerHTML = content;
        stepContainer.appendChild(stepDiv);

        // Adiciona botões de navegação
        addNavigationButtons();
    };

    // Função para adicionar os botões (Próximo, Entendi, Sim, Não, etc.)
    const addNavigationButtons = () => {
        const step = steps[currentStep];
        const navContainer = document.getElementById('form-navigation');
        navContainer.innerHTML = '';

        if (step.buttonText) {
            const nextButton = document.createElement('button');
            nextButton.type = 'button'; // Para não submeter o formulário antes da hora
            nextButton.textContent = step.buttonText;
            nextButton.onclick = handleNext;
            navContainer.appendChild(nextButton);
        }

        if (step.secondaryButtonText) {
            const secondaryButton = document.createElement('button');
            secondaryButton.type = 'button';
            secondaryButton.className = 'secondary';
            secondaryButton.textContent = step.secondaryButtonText;
            secondaryButton.onclick = () => handleSecondaryAction(step.id);
            navContainer.appendChild(secondaryButton);
        }
    };
    
    // Lida com a ação do botão principal
    const handleNext = () => {
        const step = steps[currentStep];
        const input = form.querySelector(`[name="${step.id}"]`);

        // Validação simples
        if (input) {
            let value;
            if (input.type === 'radio') {
                const checked = form.querySelector(`[name="${step.id}"]:checked`);
                if (!checked) {
                    alert('Por favor, selecione uma opção.');
                    return;
                }
                value = checked.value;
            } else {
                if (!input.value) {
                    alert('Por favor, preencha o campo.');
                    return;
                }
                value = input.value;
            }
            // Armazena o dado
            formData[step.id] = value;
        }

        // Lógica condicional
        // Se a pessoa não sabe sobre tráfego pago, pula para a explicação
        if (step.id === 'sabe_trafego' && formData.sabe_trafego === 'NÃO❌') {
            currentStep = steps.findIndex(s => s.id === 'explicacao_trafego');
            renderStep();
            return;
        }
        
        // Se a pessoa não está no momento, encerra
        if (step.id === 'decisao_final' && formData.decisao_final === 'nao') {
            form.innerHTML = "<h2>Entendido.</h2><p>Agradecemos seu interesse! Quando for o momento certo, estaremos por aqui.</p>";
            return;
        }

        // Avança para o próximo passo
        currentStep++;
        if (currentStep < steps.length) {
            // Se o próximo passo é a submissão final
            if (steps[currentStep].type === 'submit') {
                // Anexa os dados como campos ocultos antes de submeter
                for (const key in formData) {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = key;
                    hiddenInput.value = formData[key];
                    form.appendChild(hiddenInput);
                }
                form.submit(); // Envia o formulário
                // Mostra a mensagem final
                stepContainer.innerHTML = steps[currentStep + 1].content;
                document.getElementById('form-navigation').innerHTML = '';
            } else {
                renderStep();
            }
        }
    };

    // Lida com botões secundários (ex: "Ainda não é o meu momento…")
    const handleSecondaryAction = (id) => {
        if (id === 'investimento_final') {
            form.innerHTML = "<div class='form-step'><h2>Entendido.</h2><p>Agradecemos seu interesse! Quando for o momento certo para investir, estaremos por aqui para ajudar a sua empresa a crescer.</p></div>";
        }
    };

    // Definição de todos os passos do formulário
    const steps = [
        { type: 'intro', id: 'intro', content: '<h2>Falta pouco para sua empresa virar referência na sua região...</h2><p>Receba o suporte que falta para estruturar de vez seu processo de vendas online e alavancar o faturamento do seu negócio...</p><p>🕑 Leva menos de 2 minutos.</p>', buttonText: 'Começar' },
        { type: 'text', id: 'nome', label: 'Primeiramente, qual é o seu nome?', buttonText: 'Avançar' },
        { type: 'text', id: 'nome_empresa', label: 'E qual o nome da sua empresa?', buttonText: 'Avançar' },
        { type: 'radio', id: 'tipo_empresa', label: 'Em qual opção você melhor se encaixa?', options: ['Ainda não tenho uma empresa', 'Tenho uma empresa que VENDE PRODUTOS', 'Tenho uma empresa que VENDE SERVIÇOS'], buttonText: 'Avançar' },
        { type: 'radio', id: 'sabe_trafego', label: 'Você sabe como funciona o Tráfego Pago?', options: ['SIM✅', 'NÃO❌'], buttonText: 'Avançar' },
        { id: 'explicacao_trafego', type: 'info', content: '<div class="info-box"><h3>O que é Tráfego Pago?</h3><p>É a forma mais estratégica de anunciar online, colocando seu produto ou serviço na frente das pessoas certas, no momento certo. Sabe quando você entra num site, olha um produto, e depois começa a ver ele te “seguindo” por aí — no Instagram, no YouTube ou no Google? Pois é… isso é tráfego pago em ação. É uma das maneiras mais rápidas e eficazes de atrair novos clientes.</p></div>', buttonText: 'Entendi, continuar' },
        { type: 'radio', id: 'cargo', label: 'Na (nome da empresa) você é:', options: ['Proprietário(a)', 'Gerente ou Diretor(a)', 'Outro'], buttonText: 'Avançar' },
        { type: 'email', id: 'email', label: '(nome), qual e-mail você mais usa?', buttonText: 'Avançar' },
        { type: 'tel', id: 'whatsapp', label: 'Qual seu WhatsApp com DDD? (vamos te enviar a proposta por ele)', buttonText: 'Avançar' },
        { type: 'text', id: 'instagram', label: 'Qual Instagram da sua empresa? (se não tiver, digite "não tenho")', buttonText: 'Avançar' },
        { type: 'radio', id: 'funcionarios', label: 'Quantos funcionários a (nome da empresa) tem hoje?', options: ['Somente eu', '2 a 3', '4 a 6', '6 a 9', '10 ou mais'], buttonText: 'Avançar' },
        { type: 'radio', id: 'quando_comecar', label: 'Caso a gente feche a parceria, quando seria ideal começarmos?', options: ['Amanhã', 'Próxima Semana', 'Ainda este mês', 'Próximo mês'], buttonText: 'Avançar' },
        { type: 'radio', id: 'investiu_antes', label: 'Você já investiu em anúncios online antes?', options: ['Sim, já investi', 'Ainda não, mas pretendo começar'], buttonText: 'Avançar' },
        { type: 'radio', id: 'investimento_mensal', label: 'Quanto você investe e/ou está disposto a investir POR MÊS em anúncios?', options: ['De R$ 500 a R$ 1.000', 'De R$ 1.000 a R$ 3.000', 'De R$ 3.000 a R$ 5.000', 'De R$ 5.000 a R$ 10.000', 'Acima de R$ 10.000'], buttonText: 'Avançar' },
        { type: 'info', id: 'info_ugrowth', content: '<h2>O que esperar da Ugrowth Marketing?</h2><p>O que sua empresa precisa não é só mais um prestador de serviço... É alguém que realmente: ✅ Entenda o seu negócio de verdade. ✅ Crie estratégias de vendas sob medida. ✅ Esteja ao seu lado durante o processo.</p>', buttonText: 'Estou ciente' },
        { type: 'info', id: 'investimento_final', content: '<h3>Existem 2 tipos de investimentos:</h3><p>🔹 <strong>1. Investimento em anúncios:</strong> Valor pago diretamente para as plataformas (Instagram, Facebook, Google etc.).</p><p>🔹 <strong>2. Investimento na gestão:</strong> É o valor do nosso serviço para planejar, criar e gerenciar suas campanhas.</p><p>O investimento mínimo recomendado em anúncios é de R$50 por dia (cerca de R$1.500 por mês), sem contar o valor da nossa gestão. <strong>Esse valor cabe no seu orçamento atual?</strong></p>', buttonText: '✅ Sim! Quero dar esse próximo passo!', secondaryButtonText: '❌ Ainda não é o meu momento…' },
        { type: 'submit' }, // Passo de submissão oculto
        { type: 'final', id: 'final', content: '<h2>Perfeito, (nome)!</h2><p>Obrigado pelas informações! Vou analisar seu caso com atenção.</p><p>📲 Em breve, entrarei em contato pelo WhatsApp. Pode fechar esta janela.</p>' }
    ];

    // Inicia o formulário
    renderStep();
});
