geth --datadir ./testnet --ropsten --syncmode light --ws  --wsorigins="*"  --wsapi=admin,debug,web3,eth,txpool,personal,ethash,miner,net    console  --allow-insecure-unlock 2>>geth_testnet.log