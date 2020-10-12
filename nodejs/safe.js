let web3 = require('./web3')
var BigNumber = require('BigNumber.js')
//let {compile,deploy} = require('./deploy')

//var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"safe_address","type":"string"}],"name":"Eth2Safe_Event","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"Safe2Eth_Event","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"string","name":"dst_safe_address","type":"string"}],"name":"eth2safe","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"string","name":"dst_safe_address","type":"string"}],"name":"eth2safe_from","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"safe2eth","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"toSafeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
//var addr = "0x9ef95776601da991363a7a09667618f9ffff0bd6"


function initSAFE()
{
   try
   {
		var fs   = require('fs');
		var abi  = fs.readFileSync('safe.abi','utf-8')
		var addr = fs.readFileSync('safe.addr','utf-8')

		return [abi,addr]
	}
	catch(e)
	{
		console.log('safe.abi or safe.addr dont exist.');
	}
}

class SAFE extends web3.eth.Contract
{
	constructor(abi,addr)
	{
	  super(abi,addr)
	  this.addr = addr
	  this.listen2event()
	}

	async unlock()
	{
		var owner = await this.owner()
		await web3.eth.personal.unlockAccount(owner,'12345')
		return owner
	}

	async deploy(sol)
	{
		return await this.methods.name().call()
	}
	async name()
	{
		return await this.methods.name().call()
	}
	async symbol()
	{
		return await this.methods.symbol().call()
	}
	async owner()
	{
		return await this.methods.owner().call()
	}

	async decimals()
	{
		return await this.methods.decimals().call()
	}

	async totalSupply()
	{
		return await this.methods.totalSupply().call()
	}

	async balanceOf(addr)
	{
		return await this.methods.balanceOf(addr).call()
	}

	mod ()
	{
		console.log('modules: '+ web3.modules)
	}

	utils()
	{
		console.log('utils:' + web3.utils)
	}

	async ethtxfee(gasUsed)
	{
		var gas = new BigNumber(await web3.eth.getGasPrice()).toString()
		var ethfee =  web3.utils.fromWei(gas, 'ether')
		return  gasUsed * ethfee
	}

	async safetxfee(gasUsed)
	{
		var eth_safe_rate = 1250
		return (eth_safe_rate * this.ethtxfee(gasUsed))
	}

	async getinfo()
	{
		try
		{
			var owner = await this.owner()
			console.log("name:", await this.name())
			console.log("symbol:", await this.symbol())
			console.log("owner:", owner)
			console.log("decimals:", await this.decimals())
			console.log("totalSupply:", await this.totalSupply())
			console.log("owner balance:", await this.balanceOf(owner))

		}
		catch (e) 
		{
			console.log(e)
		}
	}

	async safe2eth(to,amount,fee)
	{
		try
		{   
			console.log("SAFE::unlocking...")
			var owner = await this.unlock()

			console.log("SAFE::safe2eth...")
			var res = await this.methods.safe2eth(to,amount,fee).send({
				from: owner,
				value: 0
			})
					
				/*.then(function(receipt)
			{
				console.log("receipt:", receipt)
				//var eth_fee = this.ethtxfee(receipt.gasUsed);
				res = receipt
				
			});*/

			console.log("res:", res)
			return [res.transactionHash,await this.ethtxfee(res.gasUsed),res.blockHash,res.blockNumber];

				/*.on('transactionHash', function(hash)
			{
				
			})
			.on('confirmation', function(confirmationNumber, receipt)
			{

			})
			.on('receipt', function(receipt)
			{
				return [receipt.transactionHash,this.txfee_eth(receipt.gasUsed),receipt.blockHash,receipt.blockNumber];

			 })
			 .on('error', function(error, receipt)
			 {
				console.log("error:", error)
			 })*/
			
		}
		catch (e) 
		{
			console.log("----SAFE::safe2eth error----")
			console.log(e)
			console.log("----SAFE::safe2eth error----")
		}
	}

	async listen2event()
	{
		this.events.Safe2Eth_Event({
		fromBlock: 750
			}, function(error, event){ })
			.on('data', function(event)
			{
				console.log("-----SAFE::Safe2Eth_Event start----")
				console.log("txid:",event.transactionHash)
				console.log("dst:",event.returnValues.dst)
				console.log("amount:",event.returnValues.amount)
				console.log("fee:",event.returnValues.fee)
				console.log("-----SAFE::Safe2Eth_Event end----")

				//safe.getinfo()
			})
			.on('changed', function(event){
				// remove event from local database
			})
			.on('error', console.error);

		this.events.Eth2Safe_Event({
		fromBlock: 0
			}, function(error, event){ })
			.on('data', function(event)
			{
				console.log("-----SAFE::Eth2Safe_Event start----")
				console.log("txid:",event.transactionHash);
				console.log("eth_address:",event.returnValues.src)
				console.log("amount:",event.returnValues.amount)
				console.log("safe_address:",event.returnValues.safe_address)
				console.log("-----SAFE::Eth2Safe_Event end----")

				//safe.getinfo()
			})
			.on('changed', function(event){
				// remove event from local database
			})
			.on('error', console.error);
		}
}

var result = initSAFE()
var safe = new SAFE(JSON.parse(result[0]),result[1]);

safe.ethtxfee(345678)
module.exports = safe