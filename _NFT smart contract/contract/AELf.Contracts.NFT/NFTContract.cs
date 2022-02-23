using System;
using AElf.CSharp.Core;
using AElf.Sdk.CSharp;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AELf.Contracts.NFT
{
    public partial class NFTContract : NFTContractContainer.NFTContractBase
    {
        public override Empty Initialize(InitializeInput input)
        {
            AssertSenderIsOwner();
            Assert(State.Owner.Value == null, "Contract was already initialized !");
            State.Owner.Value = Context.Sender;
            State.Counter.Value = 0;
            State.CollectionName.Value = input.Name;
            State.CollectionSymbol.Value = input.Symbol;
            State.BaseUri.Value = input.BaseUri.ToString();
            return new Empty();
        }

        public override Int64Value MintNft(MintNftInput input)
        {
            AssertContractIsInitialized();
            var newTokenId = State.Counter.Value.Add(1);
            Assert(!Exists(newTokenId), "Token with such ID already exists !");

            Address owner = input.To;
            State.Counter.Value = State.Counter.Value.Add(1);
            State.HoldersBalanceMap[owner] = State.HoldersBalanceMap[owner].Add(1);
            State.TokenOwnerMap[newTokenId] = owner;
            State.TokenUriMap[newTokenId] = new TokenInfo{Uri = input.Uri};
            
            var newTokenIdsList = State.HoldersAllTokensIdsMap[owner] ?? new AllTokensOfOwner();
            newTokenIdsList.TokensIds.Add(newTokenId);
            State.HoldersAllTokensIdsMap[owner] = newTokenIdsList;
            
            Context.Fire(new Mint
            {
                To = input.To,
                TokenId = newTokenId
            });
            
            return new Int64Value{Value = Convert.ToInt64(newTokenId)};
        }
        
        public override Empty Transfer(TransferInput input)
        {
            var tokenId = Convert.ToInt64(input.TokenId);
            AssertValidTokenId(tokenId);
            Assert(Exists(tokenId), "Token with such ID does not exists !");
            
            Address from = Context.Sender;
            Address to = input.To;

            Assert(from == State.TokenOwnerMap[tokenId], "You are not the owner of this token !");
            Assert(to != from, "Recipient address cannot be your address");
            
            State.TokenOwnerMap[tokenId] = to;
            
            var newTokenIdsListOfSender = State.HoldersAllTokensIdsMap[from] ?? new AllTokensOfOwner();
            newTokenIdsListOfSender.TokensIds.Remove(tokenId);
            State.HoldersAllTokensIdsMap[from] = newTokenIdsListOfSender;
            State.HoldersBalanceMap[from] = State.HoldersBalanceMap[from].Sub(1);
            
            var newTokenIdsListOfReceiver = State.HoldersAllTokensIdsMap[to] ?? new AllTokensOfOwner();
            newTokenIdsListOfReceiver.TokensIds.Add(tokenId);
            State.HoldersAllTokensIdsMap[to] = newTokenIdsListOfReceiver;
            State.HoldersBalanceMap[to] = State.HoldersBalanceMap[to].Add(1);
            
            Context.Fire(new Transfer
            {
                From = from,
                To = to,
                TokenId = tokenId
            });
            
            return new Empty();
        }
        
        public override Empty SetBaseURI(BaseUriInput input)
        {
            AssertContractIsInitialized();
            AssertSenderIsOwner();
            State.BaseUri.Value = input.BaseUri;
            return new Empty();
        }

        public override Empty SetTokenURI(SetTokenUriInput input)
        {
            AssertContractIsInitialized();
            var tokenId = Convert.ToInt64(input.TokenId);
            AssertValidTokenId(tokenId);
            AssertSenderIsOwner();
            State.TokenUriMap[tokenId] = new TokenInfo{Uri = input.Uri};
            return new Empty();
        }

        private void AssertSenderIsOwner()
        {
            var owner = new Address(Address.FromBase58("2spAMe9UThTz24SLJvzhHabD8DUTcs9iq7AEKT4reunU3BipZh"));
            Assert(Context.Sender == owner, "No permission, you are not the owner.");
        }
        
        private void AssertContractIsInitialized()
        {
            Assert(State.Owner.Value != null, "Contract is not initialized");
        }
        
        public Boolean Exists(Int64 tokenId)
        {
            return State.TokenOwnerMap[tokenId] != null;
        }

        public void AssertValidTokenId(Int64 tokenId)
        {
            Assert(tokenId > 0, "The token ID must be a positive value.");
            var totalCount = State.Counter.Value;
            Assert(tokenId <= totalCount, "No token with such ID");
        }

    }
}