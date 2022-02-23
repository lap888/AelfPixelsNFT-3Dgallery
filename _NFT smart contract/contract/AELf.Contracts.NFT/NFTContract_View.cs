using System;
using System.ComponentModel;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AELf.Contracts.NFT
{
    public partial class NFTContract
    {
        public override GetCountOutput GetCount(Empty input)
        {
            AssertContractIsInitialized();
            return new GetCountOutput {Value = State.Counter.Value.ToString()};
        }

        public override StringValue GetCollectionName(Empty input)
        {
            AssertContractIsInitialized();
            return new StringValue{Value = State.CollectionName.Value};
        }

        public override StringValue GetCollectionSymbol(Empty input)
        {
            AssertContractIsInitialized();
            return new StringValue{Value = State.CollectionSymbol.Value};
        }
        
        public override StringValue GetBaseURI(Empty input)
        {
            AssertContractIsInitialized();
            return new StringValue{Value = State.BaseUri.Value};
        }
        
        public override TokenInfo GetTokenURI(Int64Value input)
        {
            AssertContractIsInitialized();
            var tokenId = Convert.ToInt64(input.Value);
            AssertValidTokenId(tokenId);
            return State.TokenUriMap[tokenId];
        }
        
        public override Int64Value GetBalanceOf(AddressMsg input)
        {
            AssertContractIsInitialized();
            return new Int64Value{Value = State.HoldersBalanceMap[input.Address]};
        }

        public override AddressMsg GetOwnerOf(Int64Value input)
        {
            AssertContractIsInitialized();
            var tokenId = Convert.ToInt64(input.Value);
            AssertValidTokenId(tokenId);
            return new AddressMsg {Address = State.TokenOwnerMap[tokenId]};
        }
        
        public override AllTokensOfOwner GetAllTokensOfOwner(AllTokensOfOwnerInput input)
        {
            AssertContractIsInitialized();
            return State.HoldersAllTokensIdsMap[input.Owner];
        }
    }
}