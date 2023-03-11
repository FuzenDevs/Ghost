import AppContext from 'AppContext';
import {useContext} from 'react';
import BackButton from 'components/common/BackButton';
import CloseButton from 'components/common/CloseButton';
import {getDefaultNewsletterSender, getSupportAddress} from 'utils/helpers';

export default function EmailReceivingPage() {
    const {brandColor, onAction, site, lastPage, member} = useContext(AppContext);

    const supportAddressEmail = getSupportAddress({site});
    const supportAddress = `mailto:${supportAddressEmail}`;
    const defaultNewsletterSenderEmail = getDefaultNewsletterSender({site});
    return (
        <div className="gh-email-receiving-faq">
            <header className='gh-portal-detail-header'>
                <BackButton brandColor={brandColor} onClick={() => {
                    if (!lastPage) {
                        onAction('switchPage', {page: 'accountEmail', lastPage: 'accountHome'});
                    } else {
                        onAction('switchPage', {page: 'accountHome'});
                    }
                }} />
                <CloseButton />
            </header>

            <div class="gh-longform">
                <h3>¡Ayuda! No recibo los correos electrónicos</h3>

                <p>Si no estás recibiendo los correoes electrónicos del boletín informativo a los que estás suscrito, aquí hay algunos puntos que puedes revisar.</p>

                <h4>Verifica que el correo electrónico es correcto</h4>

                <p>El correo electrónico que ingresaste es <strong>{member.email}</strong> &mdash; si no es correcto, puedes actualizarlo en <button className="gh-portal-btn-text" onClick={() => onAction('switchPage', {lastPage: 'emailReceivingFAQ', page: 'accountProfile'})}>el area de ajustes de cuenta</button>.</p>

                <h4>Revisa las carpetas de spam y promociones</h4>

                <p>Asegúrate de que los correos electrónicos no se hayan envíado por accidente en las carpetas de Spam o Promociones de tu bandeja de entrada. Si están aquí, da clic en "Marcar como no es Spam" y/o muévelo a tu bandeja de entrada</p>

                <h4>Crea un nuevo contacto</h4>

                <p>En el correo electrónico que utilices agrega <strong>{defaultNewsletterSenderEmail}</strong> a tu lista de contactos. Esto avisará a tu proveedor de correo electrónico que los correos electrónicos enviados desde esta dirección son seguros.</p>

                <h4>¡Envia un correo electrónico y di hola!</h4>

                <p>Envia un correcto electrónico a <strong>{defaultNewsletterSenderEmail}</strong> y salúdanos. Esto también puede ayudar a indicarle a tu proveedor de correo que se debe confiar en los correos electrónicos hacia y desde esta dirección.</p>

                <h4>Consulta tu proveedor de correo electrónico</h4>

                <p>Si tienes una cuenta de correo electrónico corporativo o gubernamental, comunícate con tu departamento de TI y pídeles que permitan recibir correos electrónicos de <strong>{defaultNewsletterSenderEmail}</strong></p>

                <h4>Ponte en contacto</h4>

                <p>Si completaste todas estas comprobaciones y aún no recibes correos electrónicos, puedes comunicarte para obtener asistencia en <a href={supportAddress} onClick={() => {
                    supportAddress && window.open(supportAddress);
                }}>{supportAddressEmail}</a>.</p>
            </div>
        </div>
    );
}
