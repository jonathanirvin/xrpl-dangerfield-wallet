import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAccounts } from "../contexts/AccountContext";

import "./balance.scss";
import Transaction from "./Transaction";
import "./transactions.scss";

function Transactions() {
    const { transactions, refreshTransactions } = useAccounts();

    const handleTransactionsRefresh = () => {
        refreshTransactions();
    };

    return (
        <div className="transactions">
            <label>
                Transactions
                <FontAwesomeIcon
                    icon={faRefresh}
                    onClick={handleTransactionsRefresh}
                />
            </label>
            <ul>
                {transactions.map( ( transaction, index ) => (
                    <li key={index}>
                        <Transaction transaction={transaction} />
                    </li>
                ) )}
            </ul>
        </div>
    );
}

export default Transactions;
