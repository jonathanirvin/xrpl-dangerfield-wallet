import { faGear, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./header.scss";
function Header() {

    const navigate = useNavigate();

    const handleSwitchToHome = () => {
        navigate( "/" );
    }

    const handleSwitchToSettings = () => {
        navigate( "/manage-account" );
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