import { faGear, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.scss";
function Header() {

    const handleSwitchToHome = () => {

    }

    const handleSwitchToSettings = () => {

    }

    return (
        <header>
            <div className="header-logo" onClick={handleSwitchToHome}>
                <FontAwesomeIcon icon={faWallet} />
                <span className="project-name">XRPL Wallet 1.0</span>
            </div>

            <div className="header-settings" onClick={handleSwitchToSettings}>
                <FontAwesomeIcon icon={faGear} />
            </div>
        </header >
    );
}

export default Header;