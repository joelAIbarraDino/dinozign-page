document.addEventListener('DOMContentLoaded', function() {
        form();
});

function form(){
        const form = document.getElementById('contact-form');
        if(!form)return;

        form.addEventListener('submit', async function(e){
                e.preventDefault();
                e.stopImmediatePropagation();

                const scrollPos = window.scrollY;

                const formData = new FormData(form);
                const submitBtn = form.querySelector('button[type="submit"]');

                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerText = "PROCESANDO...";

                try {
                        const response = await fetch('/assets/mail.php', {
                                method: 'POST',
                                body: formData,
                        });

                        // Intentamos obtener el JSON independientemente del status code
                        const result = await response.json();

                        if (result.ok) {
                                form.reset();
                                Swal.fire({
                                        icon: 'success',
                                        title: '¡Recibido!',
                                        text: 'Nos pondremos en contacto pronto.',
                                        confirmButtonColor: '#f22daa',
                                        heightAuto: false,
                                        returnFocus: false,
                                        scrollbarPadding: false
                                });
                        } else {
                                // Manejo de errores de validación (400) o servidor (500)
                                let errorMsg = 'Ocurrió un error al enviar el formulario.';

                                if (result.errors) {
                                        if (typeof result.errors === 'object') {
                                                // Convertimos el objeto de errores en una lista HTML
                                                errorMsg = '<ul style="text-align: center;list-style-type: none;">';
                                                Object.values(result.errors).forEach(err => {
                                                errorMsg += `<li>${err}</li>`;
                                                });
                                                errorMsg += '</ul>';
                                        } else {
                                                errorMsg = result.errors; // Caso de error de PHPMailer (string)
                                        }
                                }

                                Swal.fire({
                                        icon: 'error',
                                        title: 'Revisa los campos',
                                        html: errorMsg, // Usamos 'html' en lugar de 'text' para renderizar la lista
                                        confirmButtonColor: '#f22daa',
                                        heightAuto: false,
                                        returnFocus: false,
                                        scrollbarPadding: false
                                });
                        }
                } catch (e) {
                        console.error(e);
                        Swal.fire({
                                icon: 'error',
                                title: 'Error de conexión',
                                text: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
                                confirmButtonColor: '#f22daa',
                                heightAuto: false,
                                returnFocus: false,
                                scrollbarPadding: false
                        });
                } finally {
                        // Esto se ejecuta siempre, simplificando el código
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                }

        }, true);

}