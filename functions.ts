export const createTable = (dynamo: any, params: any) => {
    return new Promise((resolve, reject) => {
        dynamo.createTable(params, (err: any, data: any) => {
            if (err) {
                console.error("Erro ao criar tabela no DynamoDB", err);
                reject(err);
            } else {
                console.log("Processo de criação de tabela iniciada com sucesso no DynamoDB", data);
                resolve(data);
            }
        });
    });
}

export const waitForTableCreation = async (dynamo: any, params: any, paramsTable: any) => {
    let tableCreated = false;
    while (!tableCreated) {
        try {
            const result = await dynamo.describeTable(paramsTable).promise();
            if (result && result.Table && result.Table.TableStatus === 'ACTIVE') {
                tableCreated = true;
            }
        } catch (error: any) {
            if (error.code === 'ResourceNotFoundException') {
                console.log("A tabela ainda não existe...");
                try {
                    await createTable(dynamo, params);
                    console.log("Tabela criada com sucesso.");
                } catch (createError) {
                    console.error("Erro ao criar a tabela:", createError);
                    throw createError;
                }
            } else {
                console.error("Erro ao descrever a tabela:", error);
                throw error;
            }
        }
        if (!tableCreated) {
            console.log("Aguardando criação da tabela...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos antes de verificar novamente se a tabela foi criada
        }
    }
    return true;
};