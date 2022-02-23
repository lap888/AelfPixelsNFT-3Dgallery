using AElf.Boilerplate.TestBase;
using AElf.Cryptography.ECDSA;

namespace AELf.Contracts.NFT
{
    public class NFTContractTestBase : DAppContractTestBase<NFTContractTestModule>
    {
        // You can get address of any contract via GetAddress method, for example:
        // internal Address DAppContractAddress => GetAddress(DAppSmartContractAddressNameProvider.StringName);

        internal NFTContractContainer.NFTContractStub GetNFTContractStub(ECKeyPair senderKeyPair)
        {
            return GetTester<NFTContractContainer.NFTContractStub>(DAppContractAddress, senderKeyPair);
        }
    }
}