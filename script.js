document.addEventListener('DOMContentLoaded', function() { 
 const form = document.getElementById('assessmentForm'); 
 let currentStep = 0; 
 const formData = {}; 

 const steps = [ 
 // Passo 0: Saudação 
 { 
 type: 'greeting', 
 content: ` 
 <h2>Falta pouco para sua empresa virar referência...</h2> 
 <p>Receba o suporte que falta...</p> 
 <p>🕑 Leva menos de 2 minutos.</p> 
 ` 
 }, 
 // Outros passos do formulário... 
 ]; 

 function showStep(stepIndex) { 
 form.innerHTML = ''; // Limpa o formulário 
 const step = steps[stepIndex]; 

 if (step.type === 'greeting') { 
 const greetingDiv = document.createElement('div'); 
 greetingDiv.innerHTML = step.content; 
 const startButton = document.createElement('button'); 
 startButton.textContent = 'Começar'; 
 startButton.type = 'button'; 
 startButton.onclick = () => { 
 currentStep++; 
 showStep(currentStep); 
 }; 
 greetingDiv.appendChild(startButton); 
 form.appendChild(greetingDiv); 
 } 
 // Adicione a lógica para outros tipos de passos aqui 
 } 

 showStep(currentStep); 
}); 
