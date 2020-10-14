#include "mysqlite.h"

bool mySQLiteDB::open(std::string dbfilename)
{
	int rc = sqlite3_open(dbfilename.c_str(), &mydb);

	if (SQLITE_OK != rc)
	{
		printf("Can't open database: %s\n", sqlite3_errmsg(mydb));
		return false;
	}

	if (!tab.empty() && !tableExist(tab) && !sql.empty())
	{
		if (!exec(sql.c_str(), nullptr, nullptr))
		{
			printf("cann't create table %s on database: %s\n", tab.c_str(), dbfilename.c_str());
			return false;
		}
	}
	if (!tab2.empty() && !tableExist(tab2) && !sql2.empty())
	{
		if (!exec(sql2.c_str(), nullptr, nullptr))
		{
			printf("cann't create table %s on database: %s\n", tab2.c_str(), dbfilename.c_str());
			return false;
		}
	}
	return true;
}

bool mySQLiteDB::exec(std::string sql, SQLITE3_CALLBACK callback,void* pData)
{
	char* zErrMsg = nullptr;
	if (mydb == 0)
	{
		printf("SQL error: %s\n", "open sqlite db first.");
		return false;
	}
	
	int rc = sqlite3_exec(mydb, sql.c_str(), callback, pData, &zErrMsg);
	if (rc != SQLITE_OK)
	{
		printf("SQL error: %s\n", zErrMsg);
		sqlite3_free(zErrMsg);
		return false;
	}
	return true;
}

void mySQLiteDB::close()
{
	if(mydb)
		sqlite3_close(mydb);
	mydb = 0;
}


int mySQLiteDB::tableExist_callback(void* pHandle, int iRet, char** szSrc, char** szDst)
{
	//... 
	if (1 == iRet)
	{
		int iTableExist = atoi(*(szSrc));  //�˴�����ֵΪ��ѯ��ͬ����ĸ�����û����Ϊ0���������0
		if (pHandle != nullptr)
		{
			int* pRes = (int*)pHandle;
			*pRes = iTableExist;
		}
		// szDst ָ�������Ϊ"count(*)"
	}

	return 0; //����ֵһ��Ҫд�������´ε��� sqlite3_exec(...) ʱ�᷵�� SQLITE_ABORT
}

bool mySQLiteDB::tableExist(const std::string& strTableName)
{
	std::string strFindTable = "SELECT COUNT(*) FROM sqlite_master where type ='table' and name ='" + strTableName + "'";
	int nTableNums = 0;
	if (!exec(strFindTable, &tableExist_callback, (void*)&nTableNums))
	{
		return false;
	}
	return nTableNums > 0;
}