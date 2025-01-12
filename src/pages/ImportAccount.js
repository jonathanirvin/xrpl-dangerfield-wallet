import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { Wallet } from "xrpl";
import { useAccounts } from "../contexts/AccountContext";
import "./import-account.scss";

function ImportAccount() {
    const [ seed, setSeed ] = useState( "" );
    const { addAccount } = useAccounts();
    const navigate = useNavigate();

    const handleSeedChange = ( event ) => {
        setSeed( event.target.value );
    }

    const handleImportAccount = ( event ) => {
        event.preventDefault();

        const newAccount = Wallet.deriveWallet( seed );

        const account = {
            address: newAccount.classicAddress,
            seed: newAccount.seed
        }

        addAccount( account );

        navigate( "/manage-account" );

    }
    return (
        <div className="import-account">
            <Form onSubmit={handleImportAccount}>
                <h1>
                    <FontAwesomeIcon icon={faFileImport} />
                    <span>Import Account</span>
                </h1>

                <Form.Group className="seed-container" controlId="formImportSeed">
                    <Form.Label>Family Seed</Form.Label>
                    <Form.Control onChange={handleSeedChange} value={seed} type="text" required />
                </Form.Group>

                <Button type="submit" variant="primary">
                    Import
                </Button>
            </Form>
        </div>
    );
}

export default ImportAccount;
