document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.querySelector('.menu-hamburguesa');
  const navMenu = document.querySelector('nav');
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
});


console.log("JavaScript cargado - verificando elementos...");

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    console.log("Formulario de contacto encontrado - inicializando validación");
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Formulario enviado - validando...");
        
        const nombre = document.getElementById('nombre').value.trim();
        const colonia = document.getElementById('colonia').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const situacion = document.getElementById('situacion').value;
        
        resetErrors();
        
        let isValid = true;
   
        if (nombre === '') {
            showError('nombre', 'Por favor ingresa tu nombre completo');
            isValid = false;
        }

        if (colonia === '') {
            showError('colonia', 'Por favor ingresa tu colonia');
            isValid = false;
        }

        if (telefono === '') {
            showError('telefono', 'Por favor ingresa tu teléfono');
            isValid = false;
        } else if (!isValidPhone(telefono)) {
            showError('telefono', 'Por favor ingresa un teléfono válido (10 dígitos)');
            isValid = false;
        }

        if (email === '') {
            showError('email', 'Por favor ingresa tu email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Por favor ingresa un email válido');
            isValid = false;
        }

        if (situacion === '') {
            showError('situacion', 'Por favor selecciona tu situación actual');
            isValid = false;
        }
        
        if (isValid) {
            console.log("Formulario válido - mostrando éxito");
            showSuccess();
            contactForm.reset();
        } 
    });
} else {
    console.log("ERROR: No se encontró el formulario con id='contactForm'");
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        field.style.borderColor = 'var(--error)';
        field.parentNode.appendChild(errorDiv);
    }
}

function resetErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const fields = ['nombre', 'colonia', 'telefono', 'email', 'situacion'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = 'var(--bordes)';
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
}

function showSuccess() {
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.backgroundColor = 'var(--exito)';
    successDiv.style.color = 'white';
    successDiv.style.padding = '15px';
    successDiv.style.borderRadius = '5px';
    successDiv.style.marginTop = '20px';
    successDiv.style.textAlign = 'center';
    successDiv.style.fontWeight = 'bold';
    successDiv.textContent = '¡Formulario enviado con éxito! Te contactaremos pronto.';
    
    contactForm.parentNode.insertBefore(successDiv, contactForm.nextSibling);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

console.log("Cargando modo oscuro...");

const toggleButton = document.createElement('button');
toggleButton.id = 'toggleModoOscuro';
toggleButton.textContent = '🌙 Modo Oscuro';
toggleButton.style.position = 'fixed';
toggleButton.style.top = '100px';
toggleButton.style.right = '20px';
toggleButton.style.zIndex = '1000';
document.body.appendChild(toggleButton);

toggleButton.addEventListener('click', function() {
    console.log("Botón clickeado - cambiando modo...");
    document.body.classList.toggle('modo-oscuro');
    
    if (document.body.classList.contains('modo-oscuro')) {
        toggleButton.textContent = '☀ Modo Claro';
        localStorage.setItem('modoOscuro', 'activado');
        console.log("Modo oscuro ACTIVADO");
    } else {
        toggleButton.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('modoOscuro', 'desactivado');
        console.log("Modo oscuro DESACTIVADO");
    }
});

if (localStorage.getItem('modoOscuro') === 'activado') {
    document.body.classList.add('modo-oscuro');
    toggleButton.textContent = '☀ Modo Claro';
    console.log("Modo oscuro cargado desde localStorage");
}

console.log("Modo oscuro inicializado");

