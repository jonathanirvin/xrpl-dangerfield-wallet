import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Client, dropsToXrp, Wallet, xrpToDrops } from "xrpl";
import { ToastManager } from "../components/Toast";
const AccountContext = createContext();

export const AccountProvider = ( { children } ) => {
    const client = useRef();
    const [ accounts, setAccounts ] = useState( [] );
    const [ selectedWallet, setSelectedWallet ] = useState();
    const [ balance, setBalance ] = useState();
    const [ reserve, setReserve ] = useState();
    const [ transactions, setTransactions ] = useState( [] );

    const _getTransactions = useCallback( async ( account ) => {
        if ( account ) {
            const client = new Client( process.env.REACT_APP_NETWORK );
            await client.connect();

            try {
                const allTransactions = await client.request( {
                    command: "account_tx",
                    account: account.address,
                    ledger_index_min: -1, // -1 is the earliest validated ledger
                    ledger_index_max: -1, // -1 is the newest validated ledger
                    limit: 20, // Optional - limit transactions to receive 
                    forward: false, // newest ledgers first
                } );

                // Filter transactions - keep only payments made in XRP
                const filteredTransactions = allTransactions.result.transactions.filter( ( transaction ) => {

                    // Payment transactions only
                    if ( transaction.tx_json.TransactionType !== "Payment" ) return false;

                    // Filter for only XRP payments (payments made through custom tokens will be objects)
                    return typeof transaction?.meta?.delivered_amount === "string";
                } ).map( ( transaction ) => {
                    return {
                        account: transaction.tx_json.Account,
                        destination: transaction.tx_json.Destination,
                        hash: transaction.tx_json.hash,
                        direction: transaction.tx_json.Account === account.address ? "Sent" : "Received",
                        date: new Date( ( transaction.tx_json.date + 946684800 ) * 1000 ),
                        TransactionResult: transaction.meta.TransactionResult,
                        amount: transaction.meta.TransactionResult === "tesSUCCESS" ? dropsToXrp( transaction.meta?.delivered_amount ) : 0
                    }
                } );

                setTransactions( filteredTransactions );
            } catch ( error ) {
                setTransactions( [] );
                console.error( '_getTransactions error: ', error );
            } finally {
                await client.disconnect();
            }
        }
    }, [] );

    const _getBalance = useCallback( async ( account ) => {
        if ( account ) {
            const client = new Client( process.env.REACT_APP_NETWORK );
            await client.connect();

            try {
                const response = await client.request( {
                    command: "account_info",
                    account: account.address,
                    ledger_index: "validated"
                } );

                setBalance( dropsToXrp( response.result.account_data.Balance ) );
            } catch ( error ) {
                console.error( '_getBalance() error', error );
                setBalance();
            }
        }
    }, [] );

    useEffect( () => {
        const storedAccounts = localStorage.getItem( "accounts" );
        const storedDefault = localStorage.getItem( "selectedAccount" );
        if ( storedAccounts ) {
            setAccounts( JSON.parse( storedAccounts ) );
        }

        if ( storedDefault ) {
            setSelectedWallet( JSON.parse( storedDefault ) );
        }

        const getCurrentReserve = async () => {
            const client = new Client( process.env.REACT_APP_NETWORK );
            await client.connect();

            try {
                const response = await client.request( {
                    command: "server_info",
                } );

                const reserve = response.result.info.validated_ledger.reserve_base_xrp;

                setReserve( reserve );
            } catch ( error ) {
                console.error( 'error', error );
            }
        }
        getCurrentReserve();
    }, [] );


    useEffect( () => {

        if ( !client.current ) {
            client.current = new Client( process.env.REACT_APP_NETWORK );
        }

        const onTransaction = async ( event ) => {
            if ( event.meta.TransactionResult === "tesSUCCESS" ) {
                if ( event.tx_json.Account === selectedWallet.address ) {
                    ToastManager.addToast( `Successfully sent ${ dropsToXrp( event.meta?.delivered_amount ) } XRP` );
                } else if ( event.tx_json.Destination === selectedWallet.address ) {
                    ToastManager.addToast( `Successfully received ${ dropsToXrp( event.meta?.delivered_amount ) } XRP` );
                }
            } else {
                ToastManager.addToast( "Failed!" );
            }
            _getBalance( selectedWallet );
            _getTransactions( selectedWallet );
        }

        const listenToWallet = async () => {
            try {
                if ( !client.current.isConnected() ) await client.current.connect();

                client.current.on( "transaction", onTransaction );

                await client.current.request( {
                    command: "subscribe",
                    accounts: [ selectedWallet?.address ]
                } );

            } catch ( error ) {
                console.error( 'error', error );
            }
        }
        selectedWallet && listenToWallet();

        _getBalance( selectedWallet );
        _getTransactions( selectedWallet );

        return () => {
            // clean up if there is a previous connection still open
            if ( client.current.isConnected() ) {
                ( async () => {
                    client.current.removeListener( "transaction", onTransaction );
                    await client.current.request( {
                        command: "unsubscribe",
                        accounts: [ selectedWallet?.address ],
                    } )
                } )();
            }
        }
    }, [ selectedWallet, _getBalance, _getTransactions ] )

    const refreshTransactions = () => {
        _getTransactions( selectedWallet );
    }

    const refreshBalance = () => {
        _getBalance( selectedWallet );
    }

    const selectWallet = ( account ) => {
        localStorage.setItem( "selectedAccount", JSON.stringify( account ) );
        setSelectedWallet( account );
    }

    const generateAndFundWalletWithFaucet = async () => {
        if ( !client.current ) {
            client.current = new Client( process.env.REACT_APP_NETWORK );
        }

        if ( !client.current.isConnected() ) await client.current.connect();

        const faucetHost = process.env.REACT_APP_FAUCET_NETWORK;
        const faucetRequest = await client.current.fundWallet( null, { faucetHost } );
        return faucetRequest.wallet;
    }

    const sendXRP = async ( amount, destination, destinationTag ) => {

        if ( !selectedWallet ) throw new Error( "No wallet selected" );

        const wallet = Wallet.fromSeed( selectedWallet.seed );
        const client = new Client( process.env.REACT_APP_NETWORK );
        await client.connect();

        try {
            const payment = {
                TransactionType: "Payment",
                Account: wallet.classicAddress,
                Amount: xrpToDrops( amount ),
                Destination: destination,
            }

            if ( destinationTag ) {
                payment.DestinationTag = parseInt( destinationTag );
            }

            const prepared = await client.autofill( payment );

            const signed = wallet.sign( prepared );
            await client.submitAndWait( signed.tx_blob );
        } catch ( error ) {
            console.error( '_getBalance() error', error );
        } finally {
            await client.disconnect();

            refreshBalance( selectWallet );
            refreshTransactions( selectWallet );
        }

    }

    const addAccount = ( account ) => {
        setAccounts( ( prevAccounts ) => {

            const isDuplicate = prevAccounts.some( ( a ) => a.address === account.address );

            if ( isDuplicate ) {
                // TODO: Update to use notifications system
                console.log( "Account duplication: not added" );
            } else {
                const updatedAccounts = [ ...prevAccounts, account ];
                localStorage.setItem( "accounts", JSON.stringify( updatedAccounts ) );
                return updatedAccounts;
            }
        } );
    }

    const removeAccount = ( account ) => {
        setAccounts( ( prevAccounts ) => {
            const updatedAccounts = prevAccounts.filter( ( a ) => a !== account );
            localStorage.setItem( "accounts", JSON.stringify( updatedAccounts ) );
            return updatedAccounts;
        } )
    }

    return (
        <AccountContext.Provider value={{ accounts, balance, reserve, transactions, selectedWallet, addAccount, removeAccount, selectWallet, refreshBalance, refreshTransactions, sendXRP, generateAndFundWalletWithFaucet }}>{children}</AccountContext.Provider>
    );
}

export const useAccounts = () => useContext( AccountContext );