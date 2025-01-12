import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Client, dropsToXrp } from "xrpl";

const AccountContext = createContext();

export const AccountProvider = ( { children } ) => {
    const [ accounts, setAccounts ] = useState( [] );
    const [ selectedWallet, setSelectedWallet ] = useState();
    const [ balance, setBalance ] = useState();
    const [ reserve, setReserve ] = useState();

    const _getBalance = useCallback( async ( account ) => {
        console.log( 'adasfsdf account', account );
        if ( account ) {
            const client = new Client( process.env.REACT_APP_NETWORK );
            await client.connect();

            try {
                console.log( 'xxxxxx account', account );
                const response = await client.request( {
                    command: "account_info",
                    account: account.address,
                    ledger_index: "validated"
                } );

                console.log( 'response', response );

                setBalance( dropsToXrp( response.result.account_data.Balance ) );
            } catch ( error ) {
                console.error( '_getBalance() error', error );
                setBalance();
            }
        }
    } );

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
        console.log( 'use effect for selectedwallet' );
        _getBalance( selectedWallet );
    }, [ selectedWallet, _getBalance ] )



    const refreshBalance = () => {
        _getBalance( selectedWallet );
    }

    const selectWallet = ( account ) => {
        localStorage.setItem( "selectedAccount", JSON.stringify( account ) );
        setSelectedWallet( account );
        console.log( 'selectedWallet', selectedWallet );
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
        <AccountContext.Provider value={{ accounts, balance, reserve, addAccount, removeAccount, selectWallet, refreshBalance }}>{children}</AccountContext.Provider>
    );
}

export const useAccounts = () => useContext( AccountContext );