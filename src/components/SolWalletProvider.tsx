import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
    BitKeepWalletAdapter,
    BitpieWalletAdapter,
    BloctoWalletAdapter,
    CloverWalletAdapter,
    Coin98WalletAdapter,
    CoinhubWalletAdapter,
    GlowWalletAdapter,
    MathWalletAdapter,
    SafePalWalletAdapter,
    SolongWalletAdapter,
    TokenPocketWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

export const SolWalletProvider: FC = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
            new BitKeepWalletAdapter({ network }),
            new BitpieWalletAdapter({ network }),
            new BloctoWalletAdapter({ network }),
            new CloverWalletAdapter({ network }),
            new Coin98WalletAdapter({ network }),
            new CoinhubWalletAdapter({ network }),
            new GlowWalletAdapter({ network }),
            new MathWalletAdapter({ network }),
            new SafePalWalletAdapter({ network }),
            new SolongWalletAdapter({ network }),
            new TokenPocketWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};