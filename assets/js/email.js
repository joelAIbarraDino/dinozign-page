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
                const data = Object.fromEntries(formData.entries());
                const submitBtn = form.querySelector('button[type="submit"]');

                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerText = "PROCESANDO...";

                try {
                        const response = await fetch('https://dinozign-n8n.fn3tbx.easypanel.host/webhook/c0e29547-5d3c-4920-8613-9c269d0a0787', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        'X-Webhook-Token': 'b00c118888bd45179c08eb2fb2c1c626c0eefe1b59b35388',
                                },
                                body: JSON.stringify(data),
                        });

                        if (response.ok) {
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
                                Swal.fire({
                                        icon: 'error',
                                        title: 'Revisa los campos',
                                        text: 'Ocurrió un error al enviar el formulario.',
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