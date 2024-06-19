export declare const names: {
    managed: {
        contracts: {
            ChainStorageContainer_CTC_batches: string;
            ChainStorageContainer_SCC_batches: string;
            CanonicalTransactionChain: string;
            StateCommitmentChain: string;
            BondManager: string;
            BVM_L1CrossDomainMessenger: string;
            Proxy__BVM_L1CrossDomainMessenger: string;
            TssGroupManager: string;
            TssStakingSlashing: string;
            Proxy__BVM_L1StandardBridge: string;
            Proxy__TSS_GroupManager: string;
            Proxy__TSS_StakingSlashing: string;
        };
        delegation: {
            fraud_proof: {
                FraudProofDelegation: string;
                FraudProofDelegationManager: string;
                FraudProofDelegationSlasher: string;
                Proxy__FraudProofDelegation: string;
                Proxy__FraudProofDelegationManager: string;
                Proxy__FraudProofDelegationSlasher: string;
            };
            tss: {
                EmptyContract: string;
                TssDelegation: string;
                TssDelegationManager: string;
                TssDelegationSlasher: string;
                Proxy__TssDelegation: string;
                Proxy__TssDelegationManager: string;
                Proxy__TssDelegationSlasher: string;
            };
        };
        da: {
            BVM_EigenDataLayrChain: string;
            Proxy__BVM_EigenDataLayrChain: string;
            BVM_EigenDataLayrFee: string;
            Proxy__BVM_EigenDataLayrFee: string;
        };
        fraud_proof: {
            AssertionMap: string;
            VerifierEntry: string;
            Rollup: string;
            Proxy__AssertionMap: string;
            Proxy__Verifier: string;
            Proxy__Rollup: string;
            SubVerifiers: {
                BlockInitiationVerifier: string;
                BlockFinalizationVerifier: string;
                InterTxVerifier: string;
                StackOpVerifier: string;
                EnvironmentalOpVerifier: string;
                MemoryOpVerifier: string;
                StorageOpVerifier: string;
                CallOpVerifier: string;
                InvalidOpVerifier: string;
            };
        };
        accounts: {
            BVM_Sequencer: string;
            BVM_Proposer: string;
            BVM_Rolluper: string;
        };
        configs: {
            L1_MANTLE_ADDRESS: string;
            Local_Mantle_Token: string;
            Proxy__Local_Mantle_Token: string;
        };
    };
    unmanaged: {
        AddressDictator: string;
        ChugSplashDictator: string;
        Lib_AddressManager: string;
    };
};
