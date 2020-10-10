//����solc������
var solc = require('solc')
var web3 = require('./web3')
let fs = require('fs')

function compile(sol)
{
	//��ȡ��Լ
	let sourceCode = fs.readFileSync(sol,'utf-8').toString()

	let output = solc.compile(sourceCode)
	//console.log('output:', output)

	//console.log('abi:______',output['contracts'][':SimpleStorage']['interface'])

	//������Լ
	return output['contracts'][':SimpleStorage']
}

async function deploy(bytecode, abi)
{
	var address = ''

		try
		{
			//�˵�ַ��Ҫʹ�õ�ַ
			const accounts = await web3.eth.getAccounts()
			await web3.eth.personal.unlockAccount(accounts[0],'12345')
			var gasprice = await web3.eth.gasPrice;
			//1.ƴ�Ӻ�Լ����interface
			let contract = new web3.eth.Contract(JSON.parse(abi))
			//2.ƴ��bytecode
			contract.deploy({
			    data: bytecode,//��Լ��bytecode
			    arguments: []//�����캯�����ݲ�����ʹ������
			}).send({
			    from:accounts[0],
			    gas:'3000000',
			    gasPrice:1,
			}).then(instance =>{
			    console.log('address:',instance.options.address)
			    fs.writeFileSync('safe.addr',instance.options.address)
			})
			
			return address
		}
		catch (e) 
		{
			console.log("----deploy error----")
			console.log(e)
			console.log("----deploy error----")
		}
}

async function createSAFE()
{
	console.log('load SAFE Contract abi and bytecode...')
	var abi  = fs.readFileSync('safe.abi','utf-8').toString()
	var bytecode = fs.readFileSync('safe.bin','utf-8')

	console.log('deploy SAFE Contract...')
	addr = await deploy(bytecode, abi)
		
	if(addr == null|| addr == undefined) 
	{
		console.log("deploy: addr is empty")
		return
	}
		
	console.log('SAFE contract created successfully')
	return [abi,addr]
}

module.exports.createSAFE  = createSAFE

createSAFE()