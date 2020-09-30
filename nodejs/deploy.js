//����solc������
var solc = require('solc')
var web3 = require('./web3')
//var fs = require('fs');

function compile(sol)
{
	//��ȡ��Լ
	let fs = require('fs')
	let sourceCode = fs.readFileSync(sol)

	let output = solc.compile(sourceCode, 1)
	console.log('output:', output)

	console.log('abi:______',output['contracts'][':SimpleStorage']['interface'])

	//������Լ
	return output['contracts'][':SimpleStorage']
}

async function deploy(bytecode, abi)
{

	var address = ''

		try
		{
			//�˵�ַ��Ҫʹ�õ�ַ
			const account = await web3.eth.getAccounts()

			//1.ƴ�Ӻ�Լ����interface
			let contract = new web3.eth.Contract(JSON.parse(abi))
			//2.ƴ��bytecode
			contract.deploy({
			    data: bytecode,//��Լ��bytecode
			    arguments: []//�����캯�����ݲ�����ʹ������
			}).send({
			    from:account,
			    gas:'3000000',
			    gasPrice:'1',
			}).then(instance =>{
			    console.log('address:',instance.options.address)
			    address = instance.options.address
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

module.exports.deploy  = deploy
module.exports.compile = compile