import { faCirclePlus, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Wallet } from "xrpl";
import { useAccounts } from "../contexts/AccountContext";
import "./generate-account.scss";

function GenerateAccount() {
    const [ seed, setSeed ] = useState( null );
    const [ address, setAddress ] = useState( "" );
    const { addAccount } = useAccounts();
    const navigate = useNavigate();

    const handleGenerateAccount = () => {
        const newWallet = Wallet.generate();
        setSeed( newWallet.seed );
        setAddress( newWallet.classicAddress );
    };

    const handleSaveAccount = () => {
        // Create the new account object
        const account = {
            address: address,
            seed: seed,
        };

        // Update the application state
        addAccount( account );

        // Navigate back to the manage accounts page
        navigate( "/manage-account" );
    };

    const handleCancel = () => {
        setSeed( "" );
    };


    return (
        <div className="generate-account">
            {seed ? (
                <>
                    <h1>
                        <FontAwesomeIcon icon={faFloppyDisk} />
                        <span>Save Account</span>
                    </h1>

                    <div className="account-container">
                        <label>Address</label>
                        <div>{address}</div>
                        <label>Family Seed</label>
                        <div>{seed}</div>
                    </div>

                    <div className="action-buttons">
                        <Button variant="primary" onClick={handleSaveAccount}>Save to wallet</Button>
                        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                    </div>

                </>
            ) : (
                <>
                    <h1>
                        <FontAwesomeIcon icon={faCirclePlus} />
                        <span>Generate Account</span>
                    </h1>
                    <p>
                        Clicking generate will create a new seed and rAddress, but youll need to
                        click save to add it to your account and it won’t become active until you send it some XRP.
                    </p>
                    <Button variant="primary" onClick={handleGenerateAccount}>
                        Generate
                    </Button>
                </>
            )}
        </div>
    );
}

export default GenerateAccount;
