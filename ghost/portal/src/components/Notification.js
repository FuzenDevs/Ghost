import Frame from './Frame';
import AppContext from '../AppContext';
import NotificationStyle from './Notification.styles';
import {ReactComponent as CloseIcon} from '../images/icons/close.svg';
import {ReactComponent as CheckmarkIcon} from '../images/icons/checkmark-fill.svg';
import {ReactComponent as WarningIcon} from '../images/icons/warning-fill.svg';
import NotificationParser, {clearURLParams} from '../utils/notifications';
import {getPortalLink} from '../utils/helpers';

const React = require('react');

const Styles = () => {
    return {
        frame: {
            zIndex: '4000000',
            position: 'fixed',
            top: '0',
            right: '0',
            maxWidth: '415px',
            width: '100%',
            height: '120px',
            animation: '250ms ease 0s 1 normal none running animation-bhegco',
            transition: 'opacity 0.3s ease 0s',
            overflow: 'hidden'
        }
    };
};

const NotificationText = ({type, status, context}) => {
    const signinPortalLink = getPortalLink({page: 'signin', siteUrl: context.site.url});
    const singupPortalLink = getPortalLink({page: 'signup', siteUrl: context.site.url});

    if (type === 'signin' && status === 'success' && context.member) {
        const firstname = context.member.firstname || '';
        return (
            <p>
                ¡Hola de nuevo{(firstname ? ', ' + firstname : '')}!<br />Iniciaste sesión correctamente.
            </p>
        );
    } else if (type === 'signin' && status === 'error') {
        return (
            <p>
                No pudiste iniciar sesión, el enlace expiró. <a href={signinPortalLink} target="_parent">Clic para reintentar</a>
            </p>
        );
    } else if (type === 'signup' && status === 'success') {
        return (
            <p>
                Te suscribiste correctamente a <br /><strong>{context.site.title}</strong>
            </p>
        );
    } else if (type === 'signup-paid' && status === 'success') {
        return (
            <p>
                Te suscribiste correctamente a <br /><strong>{context.site.title}</strong>
            </p>
        );
    } else if (type === 'updateEmail' && status === 'success') {
        return (
            <p>
                ¡Correcto! Tu correo electrónico se ha actualizado.
            </p>
        );
    } else if (type === 'updateEmail' && status === 'error') {
        return (
            <p>
                ¡No se pudo actualizar el correo electrónico! Enlace no válido.
            </p>
        );
    } else if (type === 'signup' && status === 'error') {
        return (
            <p>
                Error al registrar: Enlace no válido <br /><a href={singupPortalLink} target="_parent">Clic para reintentar</a>
            </p>
        );
    } else if (type === 'signup-paid' && status === 'error') {
        return (
            <p>
                Error al registrar: Enlace no válido <br /><a href={singupPortalLink} target="_parent">Clic para reintentar</a>
            </p>
        );
    } else if (type === 'stripe:checkout' && status === 'success') {
        if (context.member) {
            return (
                <p>
                    ¡Correcto! Tu cuenta se ha activado, ahora tienes acceso a todo el contenido.
                </p>
            );
        }
        return (
            <p>
                ¡Correcto! Revisa tu correo electrónico para el enlace de inicio de sesión.
            </p>
        );
    } else if (type === 'stripe:checkout' && status === 'warning') {
        // Stripe checkout flow was cancelled
        if (context.member) {
            return (
                <p>
                    La actualización del plan fue cancelado.
                </p>
            );
        }
        return (
            <p>
                El pago fue cancelado.
            </p>
        );
    }
    return (
        <p>
            {status === 'success' ? 'Éxito' : 'Error'}
        </p>
    );
};

class NotificationContent extends React.Component {
    static contextType = AppContext;

    constructor() {
        super();
        this.state = {
            className: ''
        };
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
    }

    onNotificationClose() {
        this.props.onHideNotification();
    }

    componentDidUpdate() {
        const {showPopup} = this.context;
        if (!this.state.className && showPopup) {
            this.setState({
                className: 'slideout'
            });
        }
    }

    componentDidMount() {
        const {autoHide, duration = 2400} = this.props;
        const {showPopup} = this.context;
        if (showPopup) {
            this.setState({
                className: 'slideout'
            });
        } else if (autoHide) {
            this.timeoutId = setTimeout(() => {
                this.setState({
                    className: 'slideout'
                });
            }, duration);
        }
    }

    onAnimationEnd(e) {
        if (e.animationName === 'notification-slideout' || e.animationName === 'notification-slideout-mobile') {
            this.props.onHideNotification(e);
        }
    }

    render() {
        const {type, status} = this.props;
        const {className = ''} = this.state;
        const statusClass = status ? `  ${status}` : ' neutral';
        const slideClass = className ? ` ${className}` : '';
        return (
            <div className='gh-portal-notification-wrapper'>
                <div className={`gh-portal-notification${statusClass}${slideClass}`} onAnimationEnd={e => this.onAnimationEnd(e)}>
                    {(status === 'error' ? <WarningIcon className='gh-portal-notification-icon error' alt=''/> : <CheckmarkIcon className='gh-portal-notification-icon success' alt=''/>)}
                    <NotificationText type={type} status={status} context={this.context} />
                    <CloseIcon className='gh-portal-notification-closeicon' alt='Close' onClick={e => this.onNotificationClose(e)} />
                </div>
            </div>
        );
    }
}

export default class Notification extends React.Component {
    static contextType = AppContext;

    constructor() {
        super();
        const {type, status, autoHide, duration} = NotificationParser() || {};
        this.state = {
            active: true,
            type,
            status,
            autoHide,
            duration,
            className: ''
        };
    }

    onHideNotification() {
        const type = this.state.type;
        const deleteParams = [];
        if (['signin', 'signup'].includes(type)) {
            deleteParams.push('action', 'success');
        } else if (['stripe:checkout'].includes(type)) {
            deleteParams.push('stripe');
        }
        clearURLParams(deleteParams);
        this.context.onAction('refreshMemberData');
        this.setState({
            active: false
        });
    }

    renderFrameStyles() {
        const styles = `
            :root {
                --brandcolor: ${this.context.brandColor}
            }
        ` + NotificationStyle;
        return (
            <style dangerouslySetInnerHTML={{__html: styles}} />
        );
    }

    render() {
        const Style = Styles({brandColor: this.context.brandColor});
        const frameStyle = {
            ...Style.frame
        };
        if (!this.state.active) {
            return null;
        }
        const {type, status, autoHide, duration} = this.state;
        if (type && status) {
            return (
                <Frame style={frameStyle} title="portal-notification" head={this.renderFrameStyles()} className='gh-portal-notification-iframe' >
                    <NotificationContent {...{type, status, autoHide, duration}} onHideNotification={e => this.onHideNotification(e)} />
                </Frame>
            );
        }
        return null;
    }
}
