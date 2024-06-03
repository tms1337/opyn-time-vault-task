const contractConfig = {
  _format: "hh-sol-artifact-1",
  contractName: "Faucet",
  sourceName: "contracts/Faucet.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_dripAmount",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address",
        },
      ],
      name: "AddressEmptyCode",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "AddressInsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "FailedInnerCall",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    {
      inputs: [],
      name: "dripAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "dripToken",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "token",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
  bytecode:
    "0x60a060405234801561001057600080fd5b506040516109a23803806109a28339818101604052810190610032919061011a565b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060808181525050505061015a565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100b182610086565b9050919050565b6100c1816100a6565b81146100cc57600080fd5b50565b6000815190506100de816100b8565b92915050565b6000819050919050565b6100f7816100e4565b811461010257600080fd5b50565b600081519050610114816100ee565b92915050565b6000806040838503121561013157610130610081565b5b600061013f858286016100cf565b925050602061015085828601610105565b9150509250929050565b60805161081861018a6000396000818161014a01528181610176015281816101df015261021901526108186000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063335bbf111461004657806335a1529b14610065578063fc0c546a14610083575b600080fd5b61004e6100a1565b60405161005c929190610560565b60405180910390f35b61006d610217565b60405161007a9190610589565b60405180910390f35b61008b61023b565b6040516100989190610623565b60405180910390f35b600080600033905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610105919061065f565b602060405180830381865afa158015610122573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061014691906106ab565b90507f0000000000000000000000000000000000000000000000000000000000000000811115610209576101db827f000000000000000000000000000000000000000000000000000000000000000060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1661025f9092919063ffffffff16565b60017f0000000000000000000000000000000000000000000000000000000000000000935093505050610213565b6000809350935050505b9091565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6102d9838473ffffffffffffffffffffffffffffffffffffffff1663a9059cbb85856040516024016102929291906106d8565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506102de565b505050565b6000610309828473ffffffffffffffffffffffffffffffffffffffff1661037590919063ffffffff16565b9050600081511415801561032e57508080602001905181019061032c919061072d565b155b1561037057826040517f5274afe7000000000000000000000000000000000000000000000000000000008152600401610367919061065f565b60405180910390fd5b505050565b60606103838383600061038b565b905092915050565b6060814710156103d257306040517fcd7860590000000000000000000000000000000000000000000000000000000081526004016103c9919061065f565b60405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff1684866040516103fb91906107cb565b60006040518083038185875af1925050503d8060008114610438576040519150601f19603f3d011682016040523d82523d6000602084013e61043d565b606091505b509150915061044d868383610458565b925050509392505050565b60608261046d57610468826104e7565b6104df565b60008251148015610495575060008473ffffffffffffffffffffffffffffffffffffffff163b145b156104d757836040517f9996b3150000000000000000000000000000000000000000000000000000000081526004016104ce919061065f565b60405180910390fd5b8190506104e0565b5b9392505050565b6000815111156104fa5780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008115159050919050565b6105418161052c565b82525050565b6000819050919050565b61055a81610547565b82525050565b60006040820190506105756000830185610538565b6105826020830184610551565b9392505050565b600060208201905061059e6000830184610551565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006105e96105e46105df846105a4565b6105c4565b6105a4565b9050919050565b60006105fb826105ce565b9050919050565b600061060d826105f0565b9050919050565b61061d81610602565b82525050565b60006020820190506106386000830184610614565b92915050565b6000610649826105a4565b9050919050565b6106598161063e565b82525050565b60006020820190506106746000830184610650565b92915050565b600080fd5b61068881610547565b811461069357600080fd5b50565b6000815190506106a58161067f565b92915050565b6000602082840312156106c1576106c061067a565b5b60006106cf84828501610696565b91505092915050565b60006040820190506106ed6000830185610650565b6106fa6020830184610551565b9392505050565b61070a8161052c565b811461071557600080fd5b50565b60008151905061072781610701565b92915050565b6000602082840312156107435761074261067a565b5b600061075184828501610718565b91505092915050565b600081519050919050565b600081905092915050565b60005b8381101561078e578082015181840152602081019050610773565b60008484015250505050565b60006107a58261075a565b6107af8185610765565b93506107bf818560208601610770565b80840191505092915050565b60006107d7828461079a565b91508190509291505056fea264697066735822122073621ada0d0cb861f38932cc104ddf0023a5baa3489cec1a9afcb083226f001064736f6c63430008180033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b50600436106100415760003560e01c8063335bbf111461004657806335a1529b14610065578063fc0c546a14610083575b600080fd5b61004e6100a1565b60405161005c929190610560565b60405180910390f35b61006d610217565b60405161007a9190610589565b60405180910390f35b61008b61023b565b6040516100989190610623565b60405180910390f35b600080600033905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610105919061065f565b602060405180830381865afa158015610122573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061014691906106ab565b90507f0000000000000000000000000000000000000000000000000000000000000000811115610209576101db827f000000000000000000000000000000000000000000000000000000000000000060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1661025f9092919063ffffffff16565b60017f0000000000000000000000000000000000000000000000000000000000000000935093505050610213565b6000809350935050505b9091565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6102d9838473ffffffffffffffffffffffffffffffffffffffff1663a9059cbb85856040516024016102929291906106d8565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506102de565b505050565b6000610309828473ffffffffffffffffffffffffffffffffffffffff1661037590919063ffffffff16565b9050600081511415801561032e57508080602001905181019061032c919061072d565b155b1561037057826040517f5274afe7000000000000000000000000000000000000000000000000000000008152600401610367919061065f565b60405180910390fd5b505050565b60606103838383600061038b565b905092915050565b6060814710156103d257306040517fcd7860590000000000000000000000000000000000000000000000000000000081526004016103c9919061065f565b60405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff1684866040516103fb91906107cb565b60006040518083038185875af1925050503d8060008114610438576040519150601f19603f3d011682016040523d82523d6000602084013e61043d565b606091505b509150915061044d868383610458565b925050509392505050565b60608261046d57610468826104e7565b6104df565b60008251148015610495575060008473ffffffffffffffffffffffffffffffffffffffff163b145b156104d757836040517f9996b3150000000000000000000000000000000000000000000000000000000081526004016104ce919061065f565b60405180910390fd5b8190506104e0565b5b9392505050565b6000815111156104fa5780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008115159050919050565b6105418161052c565b82525050565b6000819050919050565b61055a81610547565b82525050565b60006040820190506105756000830185610538565b6105826020830184610551565b9392505050565b600060208201905061059e6000830184610551565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006105e96105e46105df846105a4565b6105c4565b6105a4565b9050919050565b60006105fb826105ce565b9050919050565b600061060d826105f0565b9050919050565b61061d81610602565b82525050565b60006020820190506106386000830184610614565b92915050565b6000610649826105a4565b9050919050565b6106598161063e565b82525050565b60006020820190506106746000830184610650565b92915050565b600080fd5b61068881610547565b811461069357600080fd5b50565b6000815190506106a58161067f565b92915050565b6000602082840312156106c1576106c061067a565b5b60006106cf84828501610696565b91505092915050565b60006040820190506106ed6000830185610650565b6106fa6020830184610551565b9392505050565b61070a8161052c565b811461071557600080fd5b50565b60008151905061072781610701565b92915050565b6000602082840312156107435761074261067a565b5b600061075184828501610718565b91505092915050565b600081519050919050565b600081905092915050565b60005b8381101561078e578082015181840152602081019050610773565b60008484015250505050565b60006107a58261075a565b6107af8185610765565b93506107bf818560208601610770565b80840191505092915050565b60006107d7828461079a565b91508190509291505056fea264697066735822122073621ada0d0cb861f38932cc104ddf0023a5baa3489cec1a9afcb083226f001064736f6c63430008180033",
  linkReferences: {},
  deployedLinkReferences: {},
};

export const abi = contractConfig.abi;
export default abi;
