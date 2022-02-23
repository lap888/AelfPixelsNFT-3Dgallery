using System;
using AElf.Sdk.CSharp.State;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AELf.Contracts.NFT
{
    public class NFTContractState : ContractState
    {
        // Contract Owner
        public SingletonState<Address> Owner { get; set; }
        
        // Name
        public StringState CollectionName { get; set; }
        
        // Symbol
        public StringState CollectionSymbol { get; set; }
        
        // Base URI
        public StringState BaseUri { get; set; }
        
        // Counter
        public SingletonState<long> Counter { get; set; }
        
        // TokenURI map
        public MappedState<long, TokenInfo> TokenUriMap { get; set; }
        
        // Holders Balance
        public MappedState<Address, long> HoldersBalanceMap { get; set; }
        
        // All Tokens of Owner
        public MappedState<Address, AllTokensOfOwner> HoldersAllTokensIdsMap { get; set; }
        
        // Token Owner Map
        public MappedState<long, Address> TokenOwnerMap { get; set; }
    }
}